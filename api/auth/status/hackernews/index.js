const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')

const matchReg = /#asmalltalk|#小对话/

let HTTP_AGENT = {
  agent: new HttpsProxyAgent('http://127.0.0.1:1087')
}
if (!process.env.RUN_ON_LOCAL) {
  HTTP_AGENT = {}
}

function fetchComment (id) {
  const commentUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  return fetch(commentUrl, HTTP_AGENT)
}

function listComments () {
  const itemId = process.env.HACKERNEWS_STORY_ID || 17118109
  const url = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json`
  return fetch(url, HTTP_AGENT).then((resp) => {
    if (resp.status !== 200) {
      throw new Error(`${url} --- ${resp.status} -- ${resp.statusText}`)
    }
    return resp.json().then((data) => {
      const commentIds = data.kids || []
      const commentReqs = []
      for (const id of commentIds) {
        commentReqs.push(fetchComment(id))
      }
      return Promise.all(commentReqs)
    })
  })
}

function getCommentByUser (id) {
  return listComments().then((comments) => {
    return Promise.all(comments.map(c => c.json()))
  }).then((cs) => {
    return cs.filter(c => c.by === id)
  })
}

function auth (username) {
  return getCommentByUser(username).then((comments) => {
    return comments.find(c => c.text.match(matchReg) !== null) !== undefined
  })
}

module.exports = auth
