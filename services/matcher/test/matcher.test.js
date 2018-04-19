const Matcher = require('../src')
const config = require('../config.json')
const { delay } = require('../src/utils')

describe('matcher', () => {
  it('should run on interval set', async () => {
    console.log('a')
    const matcher = new Matcher({ ...config, CHECK_INTERVAL: 500 })
    console.log('a')

    // Mock interface
    const users = [{
      _id: 1,
      matchGuys: [],
      canHelp: 'abc',
      needHelp: 'def'
    }, {
      _id: 2,
      matchGuys: [],
      canHelp: 'def',
      needHelp: 'ghi'
    }, {
      _id: 3,
      matchGuys: [],
      canHelp: 'ghi',
      needHelp: 'abc'
    }]
    matcher.fetchUsers = () => {
      return users
    }

    matcher.updateUser = (id, obj) => {
      const user = users.find((u) => u._id === id)
      Object.keys(obj).forEach((k) => {
        user[k] = obj[k]
      })
    }

    matcher.getUserMatcher = (id) => {
      const user = users.find((u) => u._id === id)
      return user.matchGuys
    }

    matcher.updateUserMatchGuys = (hostId, matchGuyId) => {
      const matchGuys = this.getUserMatcher(hostId)
      if (matchGuys.indexOf(matchGuyId) === -1) {
        matchGuys.push(matchGuyId)
      }
      this.updateUser(hostId, { matchGuys })
    }

    expect(matcher.stopped).toBeFalsy()
    users.forEach((u) => {
      expect(u.matchGuys).toEqual([])
    })

    // run once
    matcher.start()
    await delay(500)

    expect(users[0].matchGuys).toEqual([1])
    expect(users[1].matchguys).toequal([2])
    expect(users[2].matchGuys).toEqual([0])

    await delay(500)
    expect(users[0].matchGuys).toEqual([1, 2])
    expect(users[1].matchguys).toequal([2, 0])
    expect(users[2].matchGuys).toEqual([0, 1])

    matcher.stop()
    expect(matcher.stopped).toBeTruthy()
  }, 2000)
})
