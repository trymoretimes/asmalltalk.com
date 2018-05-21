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

  test('update story', (done) => {
    const body = {
      story: 'change_to_this',
    }
    handler.update({
      pathParameters: { id:  createdUser.id },
      body: JSON.stringify(body)
    }, null, (err, resp) => {
      expect(err).toBeNull()
      handler.get({ pathParameters: { id: createdUser.id } }, null, (err, resp) => {
        const data = JSON.parse(resp.body)
        expect(data.story).toEqual(body.story)
        done()
      })
    })
  })

  test('update mailed', (done) => {
    const body = {
      emailed: '5bcc74b0-58de-11e8-9bd7-7b2aa546922e',
      lastEmailAt: 1526874268771,
    }
    handler.update({
      pathParameters: { id: createdUser.id },
      body: JSON.stringify(body)
    }, null, (err, resp) => {
      expect(err).toBeNull()
      handler.get({ pathParameters: { id: createdUser.id }}, null, (err, resp) => {
        const data = JSON.parse(resp.body)
        expect(data.emailed).toEqual([body.emailed])
        expect(data.lastEmailAt).toEqual(body.lastEmailAt)
        done()
      })
    })
  })
})
