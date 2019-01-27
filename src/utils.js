const request = require('request')

async function httpGet (url) {
  return new Promise((resolve, reject) => {
    request(encodeURI(url), (error, response, body) => {
      if (error) reject(error)
      if (response) resolve(body)
    })
  })
}

module.exports = {
  httpGet
}
