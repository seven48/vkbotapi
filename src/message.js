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

  async send (text) {
    const msg = await this.bot.api.call('messages.send', {
      peer_id: this.peerId,
      message: text,
      random_id: Math.random()
    })

    if (msg.error) {
      switch (msg.error.error_code) {
        case 14:
          setTimeout(() => this.send(...arguments), 1000)
          break
      }
    }
  }
}

module.exports = {
  Message
}
