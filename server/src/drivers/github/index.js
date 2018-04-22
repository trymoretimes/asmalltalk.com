const fetch = require('node-fetch')
const urls = require('../urls')

class Github {
  constructor () {
    this.baseUrl = 'https://api.github.com/users'
    this.site = 'github'
  }

  async isValidUser (username) {
    const profile = await this.getUserProfile(username)
    return profile.login === username
  }

  async getUserProfile (username) {
    for (const url of urls) {
      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          site: this.site
        })
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
