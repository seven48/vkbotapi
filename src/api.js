const axios = require('axios')

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
    data.access_token = this.parent.token

    const url = `https://api.vk.com/method/${method}`

    return axios.get(url, {
      params: data
    }).then(response => response.data)
  }
}

module.exports = {
  API
}
