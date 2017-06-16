'use strict'

import * as crypto from 'crypto'

export function encrypt(phone: string, key: string, iv: string) {
  const encipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  let encryptdata = encipher.update(phone, 'utf8', 'base64')
  encryptdata += encipher.final('base64')
  return encryptdata
}

export function decrypt(phoneEncrypted: string, key: string, iv: string) {
  const encipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  let phone = encipher.update(phoneEncrypted, 'base64', 'utf8')
  phone += encipher.final('utf8')
  return phone
}

export function md5(data: string) {
  return crypto.createHash('md5').update(data).digest('hex')
}

export function sign(json: { [k: string]: any }, password: string) {
  let str = ''
  if (!json.mobiles) {
    // the sign processing of charge is diffirent
    str = json.account + md5(password)
  } else {
    const order = [
      'account',
      'timestamp',
      'mobiles',
      'packageSize',
      'clientOrderId'
    ]
    for (const key of order) {
      if (json[key]) {
        if (key === 'mobiles' && json[key].length > 32) {
          str += json[key].toString().substr(0, 32)
        } else {
          str += json[key]
        }
        if (key === 'account') {
          str += md5(password)
        }
      }
    }
  }
  return md5(str)
}
