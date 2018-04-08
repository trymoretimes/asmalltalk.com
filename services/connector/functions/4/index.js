const fetch = require('node-fetch')

exports.handle = function (e, ctx, cb) {
  if (e.username) {
    const url = 'https://www.v2ex.com/api/members/show.json?username=' + e.name
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
