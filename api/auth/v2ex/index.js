const fetch = require('node-fetch')

const matchReg = /#asmalltalk|#小对话/

// TODO replace hardcode
const URL = 'https://www.v2ex.com/api/replies/show.json?topic_id=452081'

function listComments () {
  const url = `${URL}&timestamp=${(new Date()).getTime()}`
  return fetch(url).then((resp) => {
    if (resp.status !== 200) {
      throw new Error(`${url} --- ${resp.status} -- ${resp.statusText}`)
    }
    return resp.json()
  })
}

function getCommentByUser (username) {
  return listComments().then((comments) => {
    return comments.filter((comment) => {
      return comment.member && comment.member.username === username
    })
  })
}

function auth(username) {
  return getCommentByUser(username).then((comments) => {
    return comments.find(c => c.content.match(matchReg) !== null) !== undefined
  })
}

module.exports = auth
