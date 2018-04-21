const Mailer = require('../src')
const config = require('../config.json')
const { delay } = require('../src/utils')

describe('mailer', () => {
  it('should run on interval set', async () => {
    const mailer = new Mailer({ ...config, CHECK_INTERVAL: 500 })

    // Mock interface
    const users = [{
      _id: 0,
      matchGuys: [1],
      emailed: [],
      canHelp: 'abc',
      needHelp: 'def'
    }, {
      _id: 1,
      matchGuys: [2],
      emailed: [],
      canHelp: 'def',
      needHelp: 'ghi'
    }, {
      _id: 2,
      matchGuys: [0],
      emailed: [],
      canHelp: 'ghi',
      needHelp: 'abc'
    }]

    mailer.api = {
      fetchUsers: () => {
        return users
      },

      fetchUser: (id) => {
        return users.find((u) => u._id === id)
      },

      updateUser: (id, obj) => {
        const user = users.find((u) => u._id === id)
        Object.keys(obj).forEach((k) => {
          user[k] = obj[k]
        })
      },

      updateMailed: (hostId, emailedId) => {
        console.log('+++')
        console.log(hostId, emailedId)
        console.log('+++')
        const { emailed } = mailer.api.fetchUser(hostId)
        if (emailed.indexOf(emailedId) === -1) {
          emailed.push(emailedId)
        }
        mailer.api.updateUser(hostId, { emailed })
      }
    }

    mailer.mail = (reciver, matcher) => {
      // fake sending
      console.log(`sending to ${reciver._id} with ${matcher._id}`)
    }

    expect(mailer.stopped).toBeFalsy()
    users.forEach((u) => {
      expect(u.emailed).toEqual([])
    })

    let error = null
    try {
      // run once
      mailer.start()
      await delay(500)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(null)

    expect(users[0].emailed).toEqual([1])
    expect(users[1].emailed).toEqual([2])
    expect(users[2].emailed).toEqual([0])

    await delay(500)
    expect(users[0].emailed).toEqual([1])
    expect(users[1].emailed).toEqual([2])
    expect(users[2].emailed).toEqual([0])

    mailer.stop()
    expect(mailer.stopped).toBeTruthy()
  }, 2000)
})
