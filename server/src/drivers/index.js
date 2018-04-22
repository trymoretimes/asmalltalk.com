const V2EX = require('./v2ex')
const Github = require('./github')

class Driver {
  constructor () {
    this.drivers = {
      v2ex: new V2EX(),
      github: new Github()
    }
  }

  isValidUser (site, username) {
    const driver = this.drivers[site]
    if (!driver) {
      throw new Error(`${site} not supported`)
    }
    return driver.isValidUser(username)
  }

  getUserProfile (site, username) {
    const driver = this.drivers[site]
    if (!driver) {
      throw new Error(`${site} not supported`)
    }
    return driver.getUserProfile(username)
  }
}

module.exports = new Driver()
