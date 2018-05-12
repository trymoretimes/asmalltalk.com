const fetch = require('node-fetch')

const matchReg = /#asmalltalk|#小对话/

function fetchComment(id) {
  const commentUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  return fetch(commentUrl).then((commentReq) => {
    if (commentReq.status === 200) {
      commentReq.json().then((data) => {
        return data
      })
    }
  })
}

function listComments () {
  // TODO replace id with created id
  const url = 'https://hacker-news.firebaseio.com/v0/item/16997962.json'
  return fetch(url).then((resp) => {
    if (resp.status !== 200) {
      throw new Error(`${url} --- ${resp.status} -- ${resp.statusText}`)
    }
    resp.json().then((data) => {
      const commentIds = data.kids || []

      const comments = []
      for (const id of commentIds) {
        fetchComment(id).then((comment) => {
          comments.push(comment)
        })
      }
      return comments
    })
  })
}

function getCommentByUser (id) {
  return listComments().then((comments) => {
    return comments.filter(c => c.by === id)
  })
}

function auth (username) {
  return getCommentByUser(username).then((comments) => {
    return comments.find(c => c.text.match(matchReg) !== null) !== undefined
  })
}

module.exports = auth
