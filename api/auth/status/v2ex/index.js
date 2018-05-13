const fetch = require('node-fetch')
const safeGet = require('../../utils').safeGet
const response = require('../../utils').response

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

function getUser(event, ctx, cb) {
  const username = safeGet(event, ['queryStringParameters', 'username'])
  const url = `https://www.v2ex.com/api/members/show.json?username=${username}`
  return fetch(url)
    .then((resp) => {
      if (resp.status !== 200) {
        // TODO
        throw new Error(`${url} --- ${resp.status} -- ${resp.statusText}`)
      } else {
        return resp.json()
      }
    })
    .then((data) => {
      response(null, 200, data, cb)
    })
    .catch((e) => {
      response(e, 500, null, cb)
    })
}

module.exports = {
  auth: auth,
  getUser: getUser,
}
