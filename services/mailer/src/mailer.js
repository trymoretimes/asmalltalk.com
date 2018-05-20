const sgMail = require('@sendgrid/mail')
const buildBody = require('./builder')
const { delay } = require('./utils')
const API = require('./api')

const CHECK_INTERVAL = 1 * 3600 * 1000
const OUR_MAIL = 'asmalltalk@iiiii.li'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
      const { lastEmailAt, match } = matcher
      if (!lastEmailAt || (now - lastEmailAt >= 24 * 3600 * 1000)) {
        const mailed = matcher.emailed || []
        if (mailed.indexOf(match) === -1) {
          const matchee = await this.api.fetchUser(match)
          await this.connect(matcher, matchee)
        }
      }
    }
  }

  async connect (matcher, matchee) {
    try {
      if (matchee) {
        await this.mail(matcher, matchee)
        const now = (new Date()).getTime()
        const obj = {
          mailed: matchee.id,
          lastEmailAt: now
        }
        await this.api.update(matcher.id, obj)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async mail (reciver, matcher) {
    const { text, html } = buildBody(reciver, matcher)
    const payload = {
      to: reciver.email,
      from: OUR_MAIL, // TODO our platform email here
      replyTo: matcher.email,
      subject: `小对话：今天为你推荐 ${matcher.username}`,
      text,
      html
    }

    await sgMail.send(payload)
  }
}

module.exports = Mailer
