const { API } = require('./api')
const { Msg } = require('./msg')
class Bot {
  constructor (options) {
    this.token = options.token
    if (!this.token) {
      throw Error('"token" is a required parameter.')
    }

    this.v = 5.92

    this.account = {}

    this.api = new API(this)
    this.msg = new Msg(this)
  }

  /**
   * Получение информации об авторизованном аккаунте
   */
  async whoAmI () {
    const identity = await this.api.call('users.get')
    if (identity.error) {
      throw Error(identity.error.error_msg)
    }
    return identity.response.shift()
  }
}

module.exports = {
  Bot
}
