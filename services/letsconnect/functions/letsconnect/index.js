const github = require('./github')
const v2ex = require('./v2ex')
const hackernews = require('./hackernews')

exports.handle = function (e, ctx, cb) {
  const site = e.site
  const username = e.username

  switch (site) {
    case 'v2ex':
      v2ex(username)
        .then(ok => cb(null, { ok }))
      break;
    case 'github':
      github(username)
        .then(ok => cb(null, { ok }))
      break
    case 'hackernews':
      hackernews(username)
        .then(ok => cb(null, { ok }))
      break

    default:
      cb(new Error(`${site} not supported yet`))
  }
}
