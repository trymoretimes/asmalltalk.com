const Driver = require('../../src/drivers/v2ex')

describe('driver', () => {
  it('getUserProfile', async () => {
    const driver = new Driver()
    const username = 'metrue'
    const profile = await driver.getUserProfile(username)
    expect(profile.username).toEqual(username)
    expect(profile.website).toEqual('http://minghe.me')
    expect(profile.twitter).toEqual('_metrue')
    expect(profile.github).toEqual('metrue')
    expect(profile.avatar).toEqual('https://cdn.v2ex.com/avatar/043a/5783/84957_normal.png?m=1458204503')
  })
})
