const fetch = require('node-fetch')

class V2EX {
  constructor () {
    this.baseUrl = 'https://www.v2ex.com/api/members/show.json'
  }

  async getUserProfile (username) {
    const info = await this._fetchProfile(username)
    const profile = this._buildUserInfo(info)
    return profile
  }

  async _fetchProfile (username) {
    const url = `${this.baseUrl}?username=${username}`
    const resp = await fetch(url)
    return resp.json()
  }

  _buildUserInfo (profile) {
    const { username, website, twitter, facebook, bio, psn, github, btc, avatar_normal } = profile
    const avatar = avatar_normal.replace(/^\/\//, 'https://')
    return {
      username,
      website,
      twitter,
      facebook,
      bio,
      psn,
      github,
      btc,
      avatar
    }
  }
}

module.exports = V2EX
