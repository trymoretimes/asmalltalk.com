const auth = require('../handler').handle

describe('auth', () => {
  test('v2ex', (done) => {
    const site = 'v2ex'
    const username = 'metrue'
    auth({ queryStringParameters: { site, username } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.ok).toBeTruthy()
      done()
    })
  })

  test('github', (done) => {
    const site = 'github'
    const username = 'metrue'
    auth({ queryStringParameters: { site, username } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.ok).toBeTruthy()
      done()
    })
  })

  test.skip('hackernews', (done) => {
    const site = 'hackernews'
    const username = 'anoncoward778'
    auth({ queryStringParameters: { site, username } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.ok).toBeTruthy()
      done()
    })
  }, 20000)
})
