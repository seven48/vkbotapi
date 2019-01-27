const utils = require('./utils')

class API {
  constructor (parent) {
    this.parent = parent
  }

  /**
   * Запрос к VK API
   * @param {String} method Вызываемый метод API
   * @param {{}} data Объект параметров { ключ: значение }
   * @returns {{}} Ответ сервера в виде JSON
   */
  async call (method, data = {}) {
    data.v = data.v || this.parent.v

    const parameters = []

    for (const key in data) {
      parameters.push(`${key}=${data[key]}`)
    }

    const url = `https://api.vk.com/method/${method}?${parameters.join('&')}&access_token=${this.parent.token}`

    return JSON.parse(await utils.httpGet(url))
  }
}

module.exports = {
  API
}
