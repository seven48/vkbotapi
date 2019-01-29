const axios = require('axios')
const utils = require('./utils')
const { Message } = require('./message')

class Msg {
  constructor (parent) {
    this.parent = parent

    this.events = {
      hear: []
    }
  }

  /** Ответ бота на сообщение пользователя */
  hear (regexp, callback) {
    this.events.hear.push({
      regexp,
      callback
    })
  }

  // /** Создание листенера */
  // listen (listener, callback) {
  //   // TODO
  // }

  /** Подключение по Long Polling */
  async poll () {
    this.parent.account = await this.parent.whoAmI()

    // Get Long Polling server
    const longPollingServerData = await this.parent.api.call('messages.getLongPollServer')

    if (longPollingServerData.error) {
      throw Error(longPollingServerData.error.error_msg)
    }

    let server = longPollingServerData.response.server
    let key = longPollingServerData.response.key
    let ts = longPollingServerData.response.ts

    // StartPoll
    while (true) {
      // Getting updates from long polling server
      const longPollingServer = `https://${server}`

      const { data } = await axios.get(longPollingServer, {
        params: {
          act: 'a_check',
          key,
          ts,
          wait: 25,
          mode: 2,
          version: 1
        }
      })

      if (data.failed) {
        console.log('Long Polling connection is broken')
        this.poll()
        return
      }

      const updates = utils.updatesAllocation(data.updates)

      // New messages
      this.newMessagesHandler(updates[4] || [])

      ts = data.ts || ts
    }
  }

  // HANDLERS

  /** Обработчик сообщений (код 4) */
  newMessagesHandler (updates) {
    for (const msg of updates) {
      // События .hear
      for (const event of this.events.hear) {
        const message = new Message({
          bot: this.parent,
          regexp: event.regexp,
          code: msg[0], // Код уведомления
          messageId: msg[1], // id сообщения
          flags: utils.flagDecoding(msg[2]), // флаги сообщения
          peerId: msg[3], // от кого пришло
          timestamp: msg[4], // когда
          roomName: msg[5], // где
          text: msg[6], // что
          attachments: msg[7] // всякая хуйня
        })

        if (message.match && !message.flags.includes('OUTBOX')) {
          event.callback(message)
        }
      }
    }
  }
}

module.exports = {
  Msg
}
