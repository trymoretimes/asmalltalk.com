const fetch = require('node-fetch')

class Github {
  constructor () {
    this.baseUrl = 'https://api.github.com/users'
  }

  async isValidUser (username) {
    const profile = await this._fetchProfile(username)
    return profile.login === username
  }

  async getUserProfile (username) {
    const info = await this._fetchProfile(username)
    const profile = this._buildUserInfo(info)
    return profile
  }

  async _fetchProfile (username) {
    const url = `${this.baseUrl}/${username}`
    const resp = await fetch(url)
    return resp.json()
  }

  _buildUserInfo (profile) {
    return {
      username: profile.login,
      website: profile.blog,
      bio: profile.bio,
      github: profile.html_url,
      avatar: profile.avatar_url,
      company: profile.company
    }
  }
}

module.exports = Github
