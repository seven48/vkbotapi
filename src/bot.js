const utils = require('./utils')
const { Msg } = require('./msg')

class Bot {
  /**
   * @param {BotOptions} options
   */
  constructor (options) {
    if (!options.token) {
      throw Error('Vk API must be specified')
    }
    this.token = options.token
    this.alias = options.alias || 'Бот'
    this.version = options.version || 5.92

    /** @type {BotCommand[]} */
    this.commands = []
  }

  /**
   * @returns {void}
   */
  async poll () {
    const pollData = await this._call('messages.getLongPollServer', {
      v: this.version
    })

    if (pollData.error) {
      throw Error(pollData.error.error_msg)
    }

    let server = pollData.response.server
    let key = pollData.response.key
    let ts = pollData.response.ts

    while (true) {
      const pollServer = `https://${server}?act=a_check&key=${key}&ts=${ts}&wait=25&mode=2&version=1`
      const data = JSON.parse(await utils.httpGet(pollServer))

      if (data.failed) {
        this.poll()
        console.log('Разорвано соединение с Long Polling')
        return
      }

      const newMessages = data.updates.filter(item => item[0] === 4)

      for (const msg of newMessages) {
        const roomName = msg[5]
        const text = roomName === ' ... ' ? `${this.alias} ${msg[6]}` : msg[6]

        for (const item of this.commands) {
          if (text.match(item.regexp)) {
            const messageInstance = new Msg(this, ...msg)
            item.callback(messageInstance)
          }
        }
      }

      ts = data.ts || ts
    }
  }

  /**
   * @param {RegExp} regexp
   * @param {(msg:VKMsg) => void} callback
   * @returns {void}
   */
  respond (regexp, callback) {
    const command = new RegExp(`${this.alias} ${regexp.source}`, regexp.flags)
    this.hear(command, callback)
  }

  /**
   * @param {RegExp} regexp
   * @param {(msg:VKMsg) => void} callback
   * @returns {void}
   */
  hear (regexp, callback) {
    const command = {
      regexp,
      callback
    }
    this.commands.push(command)
  }

  /**
   * @param {String} method
   * @param {{}} data
   * @returns {void}
   */
  async _call (method, data = {}) {
    const parameters = []
    for (const key in data) {
      parameters.push(`${key}=${data[key]}`)
    }
    const url = `https://api.vk.com/method/${method}?${parameters.join('&')}&access_token=${this.token}`

    return JSON.parse(await utils.httpGet(url))
  }
}

module.exports = {
  Bot
}
