const fetch = require('node-fetch')
const urls = require('./urls')

class V2EX {
  constructor () {
    this.baseUrl = 'https://www.v2ex.com/api/members/show.json'
  }

  async isValidUser (username) {
    const profile = await this._fetchProfile(username)
    return profile.status === 'found'
  }

  async getUserProfile (username) {
    for (const url of urls) {
      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
      }
      const resp = await fetch(url, opt)
      // TODO refactor needed
      if (resp.status === 200) {
        const data = await resp.json()
        if (!data.error) {
          return data
        } else {
          console.log(data.error, 'try next service: ', url.split('api')[0])
        }
      }
    }
    return {}
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
