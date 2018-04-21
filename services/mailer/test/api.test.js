const API = require('../src/api')
// const url = 'https://asmalltalk.com/v1/api'
const url = 'http://localhost:5002/v1/api'

describe('api', () => {
  const api = new API({ API_URL: url })
  it('update user emailed', async () => {
    const user1 = {
      username: `livid`,
      email: 'a@a.com',
      needHelp: '',
      canHelp: ''
    }

    const user2 = {
      username: 'metrue',
      email: 'b@b.com',
      needHelp: '',
      canHelp: ''
    }

    // create users first
    const created1 = await api.createUser(user1)
    expect(created1.username).toEqual(user1.username)
    expect(created1.emailed).toEqual([])

    const created2 = await api.createUser(user2)
    expect(created2.username).toEqual(user2.username)
    expect(created2.emailed).toEqual([])

    await api.updateMailed(created1._id, created2._id)
    const u1 = await api.fetchUser(created1._id)
    expect(u1._id).toEqual(created1._id)
    expect(u1.emailed).toEqual([created2._id])
    const now = (new Date()).getTime()
    expect(now - u1.lastEmailAt < 1000).toEqual(true)
  }, 10000)
})
