class Message {
  constructor (options) {
    this.bot = options.bot

    this.regexp = options.regexp

    this.code = options.code
    this.messageId = options.messageId
    this.flags = options.flags
    this.peerId = options.peerId
    this.timestamp = options.timestamp
    this.roomName = options.roomName
    this.text = options.text
    this.attachments = options.attachments

    this.match = this.text.match(this.regexp)
  }

  get user () {
    return this.bot.api.call('users.get', {
      user_ids: this.attachments.from ? this.attachments.from : this.peerId
    })
      .then(value => value.response.shift())
  }

  async send (text, options = {}) {
    options.peer_id = this.peerId
    options.message = text
    options.random_id = Math.random()

    const msg = await this.bot.api.call('messages.send', options)

    if (msg.error) {
      switch (msg.error.error_code) {
        case 14:
          setTimeout(() => this.send(...arguments), 1000)
          break
        default:
          console.log(msg.error)
      }
    }
  }

  reply (text, options = {}) {
    options.reply_to = this.messageId

    return this.send(text, options)
  }
}

module.exports = {
  Message
}
