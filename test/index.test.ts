'use strict'

import * as dotenv from 'dotenv'
dotenv.config()

import * as debug from 'debug'
import * as moment from 'moment'
import { default as DahanBank, IOption } from '../src/index'

const log = debug('test:index')
const option: IOption = {
  account: process.env.account,
  baseUrl: process.env.baseUrl,
  password: process.env.password
}
const chargeEnable = process.env.charge === 'true'

describe('index', () => {
  let dahanBank: DahanBank

  beforeAll(() => {
    dahanBank = new DahanBank(option)
  })

  test('getBalance', async () => {
    const balance = await dahanBank.getBalance()
    log('balance: %d', balance)
    expect(balance).toBeGreaterThanOrEqual(0)
  })

  test('charge', async () => {
    if (chargeEnable) {
      const result = await dahanBank.charge(
        '18021070048', 5, moment().format('YYYY-MM-DD') + Math.floor(Math.random() * 1000))
      log('charge result: %j', result)
    } else {
      log('skip charge')
    }
  })

  test('queryOrder', async () => {
    const outTradeNo = moment().format('YYYY-MM-DD') + Math.floor(Math.random() * 1000)
    const result = await dahanBank.queryOrder(outTradeNo)
    log('queryOrder result: %j', result)
  })

  test('getmobile', async () => {
    const result = await dahanBank.geomobile('13900070000')
    log('getmobile result: %j', result)
    expect(result).toEqual('广东移动')
  })
})
