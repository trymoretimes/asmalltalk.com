const octokit = require('@octokit/rest')({
  debug: true
})
// en: https://github.com/metrue/asmalltalk.com/issues/66
// zh: https://github.com/metrue/asmalltalk.com/issues/103
const WELCOME_ISSUE_IDS = [66, 103]
const matchReg = /#asmalltalk|#小对话/

octokit.authenticate({
  type: 'basic',
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_PASSWORD
})

function listComments (issueId) {
  return octokit.issues.getComments({
    owner: 'metrue',
    repo: 'asmalltalk',
    number: issueId
  }).then((raw) => {
    return raw.data
  })
}

function getCommentByUser (id) {
  const listPromises = WELCOME_ISSUE_IDS.map(i => listComments(i))
  return Promise.all(listPromises).then(results => {
    const all = []
    results.forEach((comments) => {
      comments.forEach((comment) => {
        all.push(comment)
      })
    })
    return all
  }).then((comments) => {
    return comments.filter((comment) => {
      const { user } = comment
      if (user.login === id) {
        return true
      }
      return false
    })
  })
}

function auth (username) {
  return getCommentByUser(username)
    .then((comments) => {
      return comments.find(c => c.body.match(matchReg) !== null) !== undefined
    })
}

module.exports = auth
