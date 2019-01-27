const { Bot } = require('../index')

const bot = new Bot({
  token: process.argv[2]
})

bot.msg.hear(/hello/i, msg => {
  msg.send('hello1')
  msg.send('hello2')
  msg.send('hello3')
  msg.send('hello4')
  msg.send('hello5')
})

bot.msg.poll()
