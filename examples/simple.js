const { Bot } = require('../index')

const bot = new Bot({
  token: process.argv[2]
})

bot.msg.hear(/Hello/i, async msg => {
  msg.send('Simple message')

  msg.reply('Answer')

  const user = await msg.user
  msg.send(`Hello, ${user.first_name} ${user.last_name}!`)
})

bot.msg.poll()
