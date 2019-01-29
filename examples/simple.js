const { Bot } = require('../index')

const bot = new Bot({
  token: process.argv[2]
})

bot.msg.hear(/hello/i, msg => {
  msg.send('simple message')

  msg.reply('answer')
})

bot.msg.poll()
