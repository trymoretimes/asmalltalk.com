const safeGet = require('../../utils').safeGet
const response = require('../../utils').response
const github = require('./github')
const v2ex = require('./v2ex').auth
const hackernews = require('./hackernews')

exports.handle = function (event, ctx, cb) {
  const site = safeGet(event, ['queryStringParameters', 'site'])
  const username = safeGet(event, ['queryStringParameters', 'username'])

  if (!site || !username) {
    cb(new Error('site and username needed in query string'))
  }

  switch (site) {
    case 'v2ex':
      v2ex(username)
        .then(ok => response(null, 200, { ok }, cb))
      break
    case 'github':
      github(username)
        .then(ok => response(null, 200, { ok }, cb))
      break
    case 'hackernews':
      hackernews(username)
        .then(ok => response(null, 200, { ok }, cb))
      break
    default:
      const error = new Error(`${site} not supported yet`)
      response(error, 500, { ok: false }, cb)
  }
}
