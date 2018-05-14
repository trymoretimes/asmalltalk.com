const octokit = require('@octokit/rest')({
  debug: true
})
const matchReg = /#asmalltalk|#小对话/

// TODO remove credential info before release
octokit.authenticate({
  type: 'basic',
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_PASSWORD
})

function listComments () {
  return octokit.issues.getComments({
    owner: 'metrue',
    repo: 'asmalltalk',
    number: 66
  }).then((raw) => {
    return raw.data
  })
}

function getCommentByUser (id) {
  return listComments()
    .then((comments) => {
      return comments.filter((comment) => {
        const { user, body } = comment
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
