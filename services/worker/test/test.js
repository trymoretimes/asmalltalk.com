const API = require('../api')
// const url = 'https://asmalltalk.com/v1/api'
const url = 'http://localhost:5002/v1/api'

describe('api', () => {
  const api = new API({ API_URL: url })
  it('fetch profile', async (done) => {
    let site = 'github'
    let username = 'metrue'
    let profile
    let err = null
    try {
      profile = await api.fetchProfile(username, site)
    } catch (e) {
      err = e
    }
    expect(err).toEqual(null)
    expect(profile.company).toEqual('@udacity')

    site = 'v2ex'
    try {
      profile = await api.fetchProfile(username, site)
    } catch (e) {
      err = e
    }
    expect(err).toEqual(null)
    expect(profile.twitter).toEqual('_metrue')

    done()
  })
})
