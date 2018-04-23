const mailer = require('./sendgrid')
const buildBody = require('./builder')
const { ourEmail } = require('../config.json')
const { delay } = require('./utils')
const API = require('./api')

const CHECK_INTERVAL = 1 * 3600 * 1000

class Mailer {
  constructor (config = {}) {
    this.api = new API(config)
    this.CHECK_INTERVAL = config.CHECK_INTERVAL || CHECK_INTERVAL

    this.stopped = false
  }

  async start () {
    this.stopped = false

    while (!this.stopped) {
      await this.run()
      await delay(this.CHECK_INTERVAL || CHECK_INTERVAL)
    }
  }

  stop () {
    this.stopped = true
  }

  async run () {
    const now = (new Date()).getTime()
    // matchee ---> matcher
    // we send matchee info to matcher
    const users = await this.api.fetchUsers()
    for (const matcher of users) {
      const { lastEmailAt } = matcher
      if (!lastEmailAt || (now - lastEmailAt >= 24 * 3600 * 1000)) {
        const matchGuys = matcher.matchGuys || []
        const mailed = matcher.emailed || []
        for (const guyId of matchGuys) {
          if (mailed.indexOf(guyId) === -1) {
            const matchee = await this.api.fetchUser(guyId)
            await this.connect(matcher, matchee)
            break
          }
        }
      }
    }
  }

  async connect (matcher, matchee) {
    try {
      if (matchee) {
        await this.mail(matcher, matchee)
        console.log(`mail sended to ${matcher.email} with ${matchee.email}`)
      }
      await this.api.updateMailed(matcher._id, matchee._id)
    } catch (e) {
      console.log(e)
    }
  }

  updateMailed (matcher, matchee) {
    this.api.updateMailed(matcher._id, matchee._id)
  }

  async mail (reciver, matcher) {
    const { text, html } = buildBody(reciver, matcher)
    const payload = {
      to: reciver.email,
      from: ourEmail, // TODO our platform email here
      replyTo: matcher.email,
      subject: `小对话：今天为你推荐 ${matcher.username}`,
      text,
      html
    }

    await mailer.send(payload)
    console.log(`mail send`)
  }
}

module.exports = Mailer
