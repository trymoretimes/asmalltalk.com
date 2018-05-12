const github = require('./github')
const v2ex = require('./v2ex')
const hackernews = require('./hackernews')

const safeGet = (obj = {}, paths = []) =>
  paths.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, obj)

exports.handle = function (event, ctx, cb) {
  const site = safeGet(event, ['queryStringParameters', 'site'])
  const username = safeGet(event, ['queryStringParameters', 'username'])

  if (!site || !username) {
    cb(new Error('site and username needed in query string'))
  }

  const response = (err, ok) => {
    const resp = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok })
    }
    cb(err, resp)
  }

  switch (site) {
    case 'v2ex':
      v2ex(username)
        .then(ok => response(null, ok))
      break
    case 'github':
      github(username)
        .then(ok => response(null, ok))
      break
    case 'hackernews':
      hackernews(username)
        .then(ok => response(null, ok))
      break
    default:
      const error = new Error(`${site} not supported yet`)
      response(error, false)
  }
}
