const octokit = require('@octokit/rest')({
  debug: true
})
const matchReg = /#asmalltalk|#小对话/

// TODO remove credential info before release
octokit.authenticate({
  type: 'basic',
  username: 'metrue',
  password: '***REMOVED***'
})

async function listComments () {
  const raw = await octokit.issues.getComments({
    owner: 'metrue',
    repo: 'asmalltalk',
    number: 66
  })
  return raw.data
}

async function getCommentByUser (id) {
  const comments = await listComments()
  return comments.filter((comment) => {
    const { user, body } = comment
    if (user.login === id) {
      return true
    }
    return false
  })
}

async function auth (username) {
  const comments = await getCommentByUser(username)
  return comments.find(c => c.body.match(matchReg) !== null) !== undefined
}

module.exports = auth
