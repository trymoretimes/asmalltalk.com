const fetch = require('node-fetch')

fetch('http://daac0282.ngrok.io', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'asmalltalk.worker' })
}).then((resp) => {
  console.log(resp.status)
  return resp.text()
}).then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e)
})
