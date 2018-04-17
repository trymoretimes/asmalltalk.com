const fetch = require('isomorphic-fetch')
const Server = require('../../src')
const Database = require('../helpers/db')
const { buildBody } = require('./utils')
const CONFIG = require('../config')

const API_URL = `http://${CONFIG.host}:${CONFIG.port}/v1/api`

describe('API - Comments', async () => {
  let database = null
  let server

  beforeAll(async () => {
    server = new Server(CONFIG)
    await server.start()

    database = new Database()
    await database.init({
      ...CONFIG.mongo,
      collection: 'Comments'
    })

    await database.collection.remove()
  })

  afterAll(async () => {
    await server.stop()
    await database.collection.remove()
    await database.db.close()
  })

  it('create users', async () => {
    const user1 = {
      username: 'metrue',
      email: 'john@john.me',
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
    expect(createdUser1.profile).toEqual({
      username: 'metrue',
      website: 'http://minghe.me',
      twitter: '_metrue',
      bio: 'bzW5kZWZpb',
      psn: '',
      github: 'metrue',
      btc: '',
      avatar: 'https://cdn.v2ex.com/avatar/043a/5783/84957_normal.png?m=1458204503'
    })
  })
})
