'use strict'

import * as qs from 'querystring'
import * as request from 'request'
import * as utils from './utils'

export interface IOption {
  account: string
  password: string
  baseUrl: string
}

export interface IOrderNewRequest {
  timestamp: number
  account: string
  mobiles: string // encoded
  sign: string
  packageSize: number // 1G=1000
  msgTemplateId?: string
  clientOrderId: string // length: 6-32
}

export interface IOrderNewResponse {
  resultCode: string // '00' is ok
  resultMsg: string
  failPhones: string
  clientOrderId: string
}

export interface IQueryBalanceRequest {
  account: string
  sign: string
}

export type IQueryBalanceResponse = string

export interface ISearchReportRequest {
  account: string
  clientOrderId: string
  sign: string
}

export enum Status {
  Ok = 0,
  Doing = 2,
  Fail = 3
}

export interface IReport {
  clientOrderId: string
  mobile: string
  reportTime: string
  status: Status
  errorCode: string
  errorDesc: string
}

export type ISearchReportResponse = IReport[]

export interface IGetAttributionRequest {
  mobile: string
}

export interface IGetAttributionResponse {
  resultCode?: number
  resultMsg?: string
  provinceID?: number
  yysTypeID?: number
}

async function $get(url: string, data: any) {
  return new Promise<any>((resolve, reject) => {
    request({
      json: true,
      method: 'get',
      qs: data,
      url
    }, (err, response, body) => {
      if (err) {
        reject(err)
      } else if (response.statusCode !== 200) {
        reject(new Error(`status ${response.statusCode}`))
      } else {
        resolve(body)
      }
    })
  })
}

async function $post(url: string, data: any) {
  return new Promise<any>((resolve, reject) => {
    request({
      body: data,
      json: true,
      method: 'post',
      url
    }, (err, response, body) => {
      if (err) {
        reject(err)
      } else if (response.statusCode !== 200) {
        reject(new Error(`status ${response.statusCode}`))
      } else {
        resolve(body)
      }
    })
  })
}

export async function queryBalance(option: IOption) {
  const data = {
    account: option.account,
    sign: null as string
  }
  data.sign = utils.sign(data, option.password)
  const balance = (await $get(`${option.baseUrl}/FCQueryBalanceServlet`, data)) as number
  return balance
}

export async function orderNew(option: IOption, phone: string, packageSize: number, outTradeNo: string) {
  // check outTradeNo, it's must be all number
  verifyOutTradeNo(outTradeNo)
  // adjust packageSize to times of 1000
  if ((packageSize % 1024) === 0) {
    packageSize = Math.floor(packageSize / 1024) * 1000
  }
  const data: IOrderNewRequest = {
    account: option.account,
    clientOrderId: outTradeNo,
    mobiles: phone,
    packageSize,
    sign: null as string,
    timestamp: Date.now()
  }
  data.sign = utils.sign(data, option.password)
  const md5 = utils.md5(option.password)
  data.mobiles = utils.encrypt(data.mobiles, md5.substr(0, 16), md5.substr(16, 16))
  const result = (await $post(`${option.baseUrl}/FCOrderNewServlet`, data)) as IOrderNewResponse
  return result
}

export async function searchReportData(option: IOption, outTradeNo: string) {
  // check outTradeNo, it's must be all number
  verifyOutTradeNo(outTradeNo)
  const data = {
    account: option.account,
    clientOrderId: outTradeNo,
    sign: null as string
  }
  data.sign = utils.sign(data, option.password)
  const result = (await $get(`${option.baseUrl}/FCSearchReportDataServlet`, data)) as ISearchReportResponse
  return result
}

export async function getAttribution(option: IOption, phone: string) {
  const data: IGetAttributionRequest = {
    mobile: phone
  }
  const result = (await $get(`${option.baseUrl}/FCGetAttribution`, data)) as IGetAttributionResponse
  return result
}

export function verifyOutTradeNo(outTradeNo: string) {
  // check outTradeNo, it's must be all number
  if (!outTradeNo.match(/^\d+$/)) {
    throw new Error('wrong outTradeNo format, must be a pure number string')
  }
}
