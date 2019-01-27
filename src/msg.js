class Msg {
  constructor (parent, ...options) {
    this.parent = parent
    this.messageId = options[1]
    this.flags = options[2]
    this.author = options[3]
    this.roomName = options[5]
    this.text = options[6]
    this.attach = options[7]
  }

  async send (text) {
    const msg = await this.parent._call('messages.send', {
      peer_id: this.author,
      message: text,
      v: this.parent.version,
      random_id: this.messageId
    })

    return msg
  }
}

module.exports = {
  Msg
}
