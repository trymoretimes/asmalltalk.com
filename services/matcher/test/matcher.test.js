const Matcher = require('../src/matcher')
const config = require('../config.json')
const { delay } = require('../src/utils')

describe('matcher', () => {
  it('should run on interval set', async () => {
    const matcher = new Matcher({ ...config, CHECK_INTERVAL: 500 })

    // Mock interface
    const users = [{
      id: 0,
      story: 'aa, cc',
      email: '0@email.com'
    }, {
      id: 1,
      story: 'c, dd',
      email: '1@email.com'
    }, {
      id: 2,
      story: 'dd, aa',
      email: '2@email.com'
    }]

    matcher.api = {
      fetchUsers: () => {
        return users
      },

      update: (id, match) => {
        const user = users.find((u) => u.id === id)
        if (user) {
          user.match = match
        }
      },
    }

    expect(matcher.stopped).toBeFalsy()
    users.forEach((u) => {
      expect(u.match).toEqual(undefined)
    })

    let error = null
    try {
      // run once
      matcher.start()
      await delay(500)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(null)

    expect(users[0].match).toEqual(1)
    expect(users[1].match).toEqual(0)
    expect(users[2].match).toEqual(0)

    matcher.stop()
    expect(matcher.stopped).toBeTruthy()
  }, 2000)
})
