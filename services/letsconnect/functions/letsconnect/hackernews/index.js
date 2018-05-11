const fetch = require('node-fetch')

const matchReg = /#asmalltalk|#小对话/

async function listComments () {
  // TODO replace id with created id
  const url = 'https://hacker-news.firebaseio.com/v0/item/16997962.json'
  const resp = await fetch(url)
  if (resp.status !== 200) {
    throw new Error(`${url} --- ${resp.status} -- ${resp.statusText}`)
  }
  const data = await resp.json()
  const commentIds = data.kids || []

  const comments = []
  for (const id of commentIds) {
    const commentUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    const commentReq = await fetch(commentUrl)
    if (commentReq.status === 200) {
      const comment = await commentReq.json()
      console.log(comment)
      if (c.type === 'comment') {
        comments.push(comment)
      }
    }
  }
  return comments
}

async function getCommentByUser (id) {
  const comments = await listComments()
  return comments.filter(c => c.by === id)
}

async function auth (username) {
  const comments = await getCommentByUser(username)
  return comments.find(c => c.text.match(matchReg) !== null) !== undefined
}

module.exports = auth
