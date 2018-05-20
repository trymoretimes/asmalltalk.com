const handler = require('../users/handler')

describe('users', () => {
  let createdUser
  const user = {
    email: 'a@a.com',
    username: new Date().getTime() + '',
    site: 'github'
  }
  test('create', (done) => {
    handler.create({ body: JSON.stringify(user) }, null, (err, resp) => {
      expect(err).toBeNull()
      createdUser = JSON.parse(resp.body)
      expect(createdUser.username).toEqual(user.username)
      expect(createdUser.email).toEqual(user.email)
      expect(createdUser.site).toEqual(user.site)
      done()
    })
  })

  test('list', (done) => {
    handler.list(null, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.length >= 1).toBeTruthy()
      done()
    })
  })

  test('get', (done) => {
    handler.get({ pathParameters: { id: createdUser.id } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.username).toEqual(user.username)
      expect(data.email).toEqual(user.email)
      expect(data.site).toEqual(user.site)
      done()
    })
  })

  test('update', (done) => {
    const body = {
      story: 'change_to_this',
      match: 'c@c.com',
      emailed: 'd@d.com'
    }
    handler.update({
      pathParameters: { id:  createdUser.id },
      body: JSON.stringify(body)
    }, null, (err, resp) => {
      expect(err).toBeNull()
      handler.get({ pathParameters: { id: createdUser.id } }, null, (err, resp) => {
        const data = JSON.parse(resp.body)
        expect(data.story).toEqual(body.story)
        expect(data.email).toEqual(createdUser.email)
        expect(data.match).toEqual(body.match)
        expect(data.emailed.indexOf(body.emailed) != -1).toEqual(true)
        done()
      })
    })
  }, 20000)
})
