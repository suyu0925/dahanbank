'use strict'

import * as api from './lib/api'

export { IOption } from './lib/api'

export default class DahanBank {
  private option: api.IOption

  public constructor(option: api.IOption) {
    this.option = option
  }

  /**
   * @return money, the unit is cent.
   */
  public async getBalance() {
    return await api.getBalance(this.option)
  }

  public async charge(phone: string, packageSize: number, outTradeNo: string) {
    return await api.charge(this.option, phone, packageSize, outTradeNo)
  }

  public async queryOrder(outTradeNo: string) {
    return await api.queryOrder(this.option, outTradeNo)
  }

  public async geomobile(phone: string) {
    return await api.geomobile(this.option, phone)
  }
}
