'use strict'

import * as request from './request'

export { IOption } from './request'

const OperatorList = {
  1: '移动',
  2: '联通',
  3: '电信'
} as { [k: number]: string }

const ProvinceList = {
  0: '全国',
  1: '北京', 2: '新疆', 3: '重庆', 4: '广东', 5: '浙江', 6: '天津', 7: '广西', 8: '内蒙古',
  9: '宁夏', 10: '江西', 11: '安徽', 12: '贵州', 13: '陕西', 14: '辽宁', 15: '山西', 16: '青海',
  17: '四川', 18: '江苏', 19: '河北', 20: '西藏', 21: '福建', 22: '吉林', 23: '云南', 24: '上海',
  25: '湖北', 26: '海南', 27: '甘肃', 28: '湖南', 29: '山东', 30: '河南', 31: '黑龙江', 32: '未知'
} as { [k: number]: string }

export async function getBalance(option: request.IOption) {
  return await request.queryBalance(option)
}

export async function charge(option: request.IOption, phone: string, packageSize: number, outTradeNo: string) {
  return await request.orderNew(option, phone, packageSize, outTradeNo)
}

export async function queryOrder(option: request.IOption, outTradeNo: string) {
  return await request.searchReportData(option, outTradeNo)
}

export async function geomobile(option: request.IOption, phone: string) {
  const result = await request.getAttribution(option, phone)
  if (result.resultMsg) {
    throw new Error(result.resultMsg)
  }
  return ProvinceList[result.provinceID] + OperatorList[result.yysTypeID]
}
