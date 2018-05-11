const fetch = require('node-fetch')

const matchReg = /#asmalltalk|#小对话/

// TODO replace hardcode
const URL = 'https://www.v2ex.com/api/replies/show.json?topic_id=452081'

async function listComments () {
  const url = `${URL}&timestamp=${(new Date()).getTime()}`
  const resp = await fetch(url)
  if (resp.status !== 200) {
    throw new Error(`${url} --- ${resp.status} -- ${resp.statusText}`)
  }
  return resp.json()
}

async function getCommentByUser (username) {
  const comments = await listComments()
  return comments.filter((comment) => {
    return comment.member && comment.member.username === username
  })
}

async function auth(username) {
  const comments = await getCommentByUser(username)
  return comments.find(c => c.content.match(matchReg) !== null) !== undefined
}

module.exports = auth
