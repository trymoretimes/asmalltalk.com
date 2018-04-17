const CONFIG = require('../config')
const fetch = require('isomorphic-fetch')
const Server = require('../../src')
const Database = require('../helpers/db')
const { delay } = require('../../src/utils')
const { buildBody } = require('./utils')

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe('Workflow', async () => {
  let database = null
  let server

  const config = {
    uri: 'mongodb://localhost:27017',
    db: 'users-test'
  }

  beforeAll(async () => {
    const serverConfig = {
      ...CONFIG,
      mailer: {
        CHECK_INTERVAL: 1000
      },
      matcher: {
        CHECK_INTERVAL: 1000
      }
    }
    server = new Server(serverConfig)
    await server.start()

    database = new Database()
    await database.init({
      ...config,
      collection: 'Comments'
    })
  })

  afterAll(async () => {
    await server.stop()

    await database.collection.remove()
    await database.client.close()
  })

  it('registration workflow', async () => {
    expect(server.matcher.stopped).toBeFalsy()
    expect(server.mailer.stopped).toBeFalsy()

    const user1 = {
      username: 'John',
      email: 'john@john.me',
      needHelp: 'JavaScript',
      canHelp: 'iOS'
    }
    const user2 = {
      username: 'Peter',
      email: 'peter@john.me',
      needHelp: 'JavaScript',
      canHelp: 'iOS'
    }
    const url = `${API_URL}/users`
    let payload = buildBody('POST', user1)
    let resp = await fetch(url, payload)
    const createdUser1 = await resp.json()
    expect(createdUser1.username).toBe(user1.username)
    expect(createdUser1.email).toBe(user1.email)
    expect(createdUser1.canHelp).toBe(user1.canHelp)
    expect(createdUser1.needHelp).toBe(user1.needHelp)
    expect(createdUser1.matchGuys).toEqual([])
    expect(createdUser1.emailed).toEqual([])

    payload = buildBody('POST', user2)
    resp = await fetch(url, payload)
    const createdUser2 = await resp.json()
    expect(createdUser2.username).toBe(user2.username)
    expect(createdUser2.email).toBe(user2.email)
    expect(createdUser2.canHelp).toBe(user2.canHelp)
    expect(createdUser2.needHelp).toBe(user2.needHelp)
    expect(createdUser2.matchGuys).toEqual([])
    expect(createdUser2.emailed).toEqual([])

    // wait for matcher and mailer to run
    await delay(1500)
    let url1 = `${API_URL}/users/${createdUser1._id}`
    let req1 = await fetch(url1)
    let u1 = await req1.json()

    let url2 = `${API_URL}/users/${createdUser2._id}`
    let req2 = await fetch(url2)
    let u2 = await req2.json()

    expect(u1.matchGuys).toEqual([createdUser2._id])
    expect(u2.matchGuys).toEqual([createdUser1._id])

    await delay(4000)

    url1 = `${API_URL}/users/${createdUser1._id}`
    req1 = await fetch(url1)
    u1 = await req1.json()

    url2 = `${API_URL}/users/${createdUser2._id}`
    req2 = await fetch(url2)
    u2 = await req2.json()

    expect(u1.emailed).toEqual([createdUser2._id.toString()])
    expect(u2.emailed).toEqual([createdUser1._id.toString()])
  }, 10000)
})
