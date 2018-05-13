const auth = require('../auth/handler').handle
const getV2exUser = require('../auth/v2ex/index').getUser

describe('auth', () => {
  describe('v2ex', () => {
    test('commented', (done) => {
      const site = 'v2ex'
      const username = 'metrue'
      auth({ queryStringParameters: { site, username } }, null, (err, resp) => {
        expect(err).toBeNull()
        const data = JSON.parse(resp.body)
        expect(data.ok).toBeTruthy()
        done()
      })
    })

    test('valid user', (done) => {
      const username = 'metrue'
      getV2exUser({ queryStringParameters: { username } }, null, (err, resp) => {
        expect(err).toBeNull()
        const data = JSON.parse(resp.body)
        expect(data.username).toEqual(username)
        done()
      })
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
