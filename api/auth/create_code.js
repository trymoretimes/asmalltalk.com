const safeGet = require('../utils').safeGet
const response = require('../utils').response

exports.handle = function (event, ctx, cb) {
  const site = safeGet(event, ['body', 'site'])
  const username = safeGet(event, ['body', 'username'])
  const email = safeGet(event, ['body', 'email'])

  if (!site || !username || !email) {
    const err = new Error('site, username, and email needed in query string')
    response(err, 500, null, cb)
  }

  // TODO should make more sense to generate code and persit it into storage
  const base64Str = Buffer.from(site + username + email).toString('base64')
  let code = '';
  [2, 0, 1, 4, 6, 6].forEach(i => {
    code += base64Str[i]
  })
  code = '#asmalltalk' + code
  response(null, 200, { code: code }, cb)
}
