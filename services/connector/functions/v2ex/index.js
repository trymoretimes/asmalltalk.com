const fetch = require('node-fetch')

exports.handle = function (e, ctx, cb) {
  const urls = {
    v2ex: 'https://www.v2ex.com/api/members/show.json?username=' + e.username + '&timestamp=' + Math.random(),
    github: 'https://api.github.com/users/' + e.username
  }

  const url = urls[e.site]
  if (url) {
    fetch(url).then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        cb(null, { error: res.status })
      }
    }).then((data) => {
      cb(null, data)
    }).catch((e) => {
      cb(null, { error: e })
    })
  } else {
    cb(null, { error: 'no username given' })
  }
}
