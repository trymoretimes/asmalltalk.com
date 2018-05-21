const auth = require('../auth/status/handler').handle
const getV2exUser = require('../auth/status/v2ex/index').getUser
const createCode = require('../auth/create_code').handle

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

  test('hackernews', (done) => {
    const site = 'hackernews'
    const username = 'metrue'
    auth({ queryStringParameters: { site, username } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.ok).toBeTruthy()
      done()
    })
  })

  test('create code', (done) => {
    const site = 'github'
    const username = 'metrue'
    const email = 'h.minghe@gmail.com'
    createCode({ body: JSON.stringify({ site, username, email }) }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      const base64Str = Buffer.from(site + username + email).toString('base64')
      const expected = '#asmalltalk' + base64Str[2] + base64Str[0] + base64Str[1] + base64Str[4] + base64Str[6] + base64Str[6]
      expect(data.code).toEqual(expected)
      done()
    })
  })
})
