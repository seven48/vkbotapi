const request = require('request')

async function httpGet (url) {
  return new Promise((resolve, reject) => {
    request(encodeURI(url), (error, response, body) => {
      if (error) reject(error)
      if (response) resolve(body)
    })
  })
}

function updatesAllocation (updates) {
  const result = {}

  for (const msg of updates) {
    if (!result[msg[0]]) {
      result[msg[0]] = []
    }

    result[msg[0]].push(msg)
  }

  return result
}

function flagDecoding (code) {
  const flags = []
  const legend = {
    532464: 'I DONT KNOW WHAT IT IS', // ASK SUPPORT
    131072: '',
    65536: 'HIDDEN',
    8192: 'I DONT KNOW WHAT IT IS 2', // ASK SUPPORT
    512: 'MEDIA',
    256: 'FIXED',
    128: 'DELETED',
    64: 'SPAM',
    32: 'FRIENDS',
    16: 'CHAT',
    8: 'IMPORTANT',
    4: 'REPLIED',
    2: 'OUTBOX',
    1: 'UNREAD'
  }
  let sum = code
  for (const n of Object.keys(legend).sort((a, b) => b - a)) {
    if (sum - n < 0) continue
    sum -= n
    flags.push(legend[n])
  }
  return flags
}

module.exports = {
  httpGet,
  updatesAllocation,
  flagDecoding
}
