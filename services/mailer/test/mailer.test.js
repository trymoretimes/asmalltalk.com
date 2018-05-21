const Mailer = require('../src/mailer')
const config = require('../config.json')
const { delay } = require('../src/utils')

describe('mailer', () => {
  it('should run on interval set', async () => {
    const mailer = new Mailer({ ...config, CHECK_INTERVAL: 500 })

    // Mock interface
    const users = [{
      id: 0,
      match: 1,
      emailed: [],
    }, {
      id: 1,
      match: 2,
      emailed: [],
    }, {
      id: 2,
      match: 0,
      emailed: [],
    }]

    mailer.api = {
      fetchUsers: () => {
        return users
      },

      fetchUser: (id) => {
        return users.find((u) => u.id === id)
      },

      update: (id, obj) => {
        const user = users.find((u) => u.id === id)
        Object.keys(obj).forEach((k) => {
          if (k === 'emailed') {
            user[k] = [...user[k], obj[k]]
          } else {
            user[k] = obj[k]
          }
        })
      },
    }

    mailer.mail = (reciver, matcher) => {
      // fake sending
      console.log(`sending to ${reciver.id} with ${matcher.id}`)
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
