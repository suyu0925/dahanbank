'use strict'

import * as utils from '../src/lib/utils'

describe('utils', () => {
  test('mobiles', () => {
    const phone = '18621764382'
    const key = 'a906449d5769fa73'
    const iv = '61d7ecc6aa3f6d28'
    const crypted = utils.encrypt(phone, key, iv)
    expect(crypted).toEqual('iwO35uUyOxUdNOtHEcNfkw==')
    const decrypted = utils.decrypt(crypted, key, iv)
    expect(decrypted).toEqual(phone)
  })

  test('sign:charge', () => {
    const json = {
      account: '160305',
      clientOrderId: '201609211133',
      mobiles: '18621764382',
      packageSize: '30',
      timestamp: '1474428824858'
    }
    expect(utils.sign(json, '123456')).toEqual('9eb4774236704ea641b05c81f6da781f')
  })

  test('sign:queryOrder', () => {
    const json = {
      account: 'fcAdmin',
      clientOrderId: '201609211133'
    }
    expect(utils.sign(json, '123456')).toEqual('3f990fcbfe7cca02d1294aff7e3dd3b3')
  })

  test('sign:changePwd', () => {
    const json = {
      account: 'fcAdmin',
      newPwd: '123456',
      sign: null
    }
    expect(utils.sign(json, '123456')).toEqual('6fe5a74c838dd794e6783d29ba09f0d3')
  })
})
