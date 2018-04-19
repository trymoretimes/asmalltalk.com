const Matcher = require('../src')
const config = require('../config.json')
const { delay } = require('../src/utils')

describe('matcher', () => {
  it('should run on interval set', async () => {
    const matcher = new Matcher({ ...config, CHECK_INTERVAL: 500 })

    // Mock interface
    const users = [{
      _id: 0,
      matchGuys: [],
      canHelp: 'abc',
      needHelp: 'def'
    }, {
      _id: 1,
      matchGuys: [],
      canHelp: 'def',
      needHelp: 'ghi'
    }, {
      _id: 2,
      matchGuys: [],
      canHelp: 'ghi',
      needHelp: 'abc'
    }]

    matcher.api = {
      fetchUsers: () => {
        return users
      },

      updateUser: (id, obj) => {
        const user = users.find((u) => u._id === id)
        Object.keys(obj).forEach((k) => {
          user[k] = obj[k]
        })
      },

      getUserMatcher: (id) => {
        const user = users.find((u) => u._id === id)
        return user.matchGuys
      },

      updateUserMatchGuys: (hostId, matchGuyId) => {
        const matchGuys = matcher.api.getUserMatcher(hostId)
        if (matchGuys.indexOf(matchGuyId) === -1) {
          matchGuys.push(matchGuyId)
        }
        matcher.api.updateUser(hostId, { matchGuys })
      }
    }

    expect(matcher.stopped).toBeFalsy()
    users.forEach((u) => {
      expect(u.matchGuys).toEqual([])
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

    expect(users[0].matchGuys).toEqual([1])
    expect(users[1].matchGuys).toEqual([2])
    expect(users[2].matchGuys).toEqual([0])

    await delay(500)
    expect(users[0].matchGuys).toEqual([1, 2])
    expect(users[1].matchGuys).toEqual([2, 0])
    expect(users[2].matchGuys).toEqual([0, 1])

    matcher.stop()
    expect(matcher.stopped).toBeTruthy()
  }, 2000)
})
