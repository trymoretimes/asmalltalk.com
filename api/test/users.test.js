const handler = require('../users/handler')

describe('users', () => {
  let createdUser
  const user = {
    email: 'a@a.com',
    username: 'a',
    site: 'github',
    story: 'a super cool JSer'
  }
  test('create', (done) => {
    handler.create(user, null, (err, resp) => {
      expect(err).toBeNull()
      createdUser = JSON.parse(resp.body)
      expect(createdUser.username === user.username).toBeTruthy()
      expect(createdUser.email === user.email).toBeTruthy()
      expect(createdUser.site === user.site).toBeTruthy()
      expect(createdUser.story === user.story).toBeTruthy()
      done()
    })
  })

  test('get', (done) => {
    handler.get({ pathParameters: { id: createdUser.id } }, null, (err, resp) => {
      expect(err).toBeNull()
      const data = JSON.parse(resp.body)
      expect(data.username === user.username).toBeTruthy()
      expect(data.email === user.email).toBeTruthy()
      expect(data.site === user.site).toBeTruthy()
      expect(data.story === user.story).toBeTruthy()
      done()
    })
  })

  test('update', (done) => {
    const body = {
      username: 'change_to_this',
    }
    handler.update({
      pathParameters: { id:  createdUser.id },
      body: JSON.stringify(body)
    }, null, (err, resp) => {
      expect(err).toBeNull()
      handler.get({ pathParameters: { id: createdUser.id } }, null, (err, resp) => {
        const data = JSON.parse(resp.body)
        expect(data.username).toEqual(body.username)
        done()
      })
    })
  }, 20000)
})
