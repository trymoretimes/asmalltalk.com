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
      mailed: [],
    }, {
      id: 1,
      match: 2,
      mailed: [],
    }, {
      id: 2,
      match: 0,
      mailed: [],
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
          if (k === 'mailed') {
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
      expect(u.mailed).toEqual([])
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

    expect(users[0].mailed).toEqual([1])
    expect(users[1].mailed).toEqual([2])
    expect(users[2].mailed).toEqual([0])

    await delay(500)
    expect(users[0].mailed).toEqual([1])
    expect(users[1].mailed).toEqual([2])
    expect(users[2].mailed).toEqual([0])

    mailer.stop()
    expect(mailer.stopped).toBeTruthy()
  }, 2000)
})
