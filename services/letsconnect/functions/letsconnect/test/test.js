const auth = require('../index').handle

describe('auth', () => {
  test('v2ex', (done) => {
    const site = 'v2ex'
    const username = 'metrue'
    auth({ site, username }, null, (err, data) => {
      expect(err).toBeNull()
      expect(data.ok).toBeTruthy()
      done()
    })
  })

  test('github', (done) => {
    const site = 'github'
    const username = 'metrue'
    auth({ site, username }, null, (err, data) => {
      expect(err).toBeNull()
      expect(data.ok).toBeTruthy()
      done()
    })
  })

  test('hackernews', (done) => {
    const site = 'hackernews'
    const username = 'anoncoward778'
    auth({ site, username }, null, (err, data) => {
      expect(err).toBeNull()
      expect(data.ok).toBeTruthy()
      done()
    })
  }, 20000)

})
