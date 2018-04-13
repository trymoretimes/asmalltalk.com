const fetch = require('node-fetch')

const CHECK_INTERVAL = 1000

const MAIL_SERVICE_API = 'https://wfyx3piug2.execute-api.us-east-1.amazonaws.com/prod'

class Mailer {
  constructor (dal) {
    this.dal = dal

    this.checkInterval = null
  }

  async start () {
    if (this.checkInterval === null) {
      this.checkInterval = setInterval(async () => {
        await this.run()
      }, CHECK_INTERVAL)
    }
  }

  stop () {
    if (this.checkInterval !== null) {
      try {
        clearInterval(this.checkInterval)
      } catch (e) {
        console.warn('err stop timeout checker', e)
      }
    }
    this.checkInterval = null
  }

  async run () {
    // matchee ---> matcher
    // we send matchee info to matcher
    const users = await this.dal.find()
    for (const matcher of users) {
      const matchGuys = matcher.matchGuys || []
      const mailed = matcher.emailed || []
      for (const guyId of matchGuys) {
        if (mailed.indexOf(guyId) === -1) {
          const matchee = await this.dal.findOne({ _id: guyId })
          await this.connect(matchee, matcher)
          break
        }
      }
    }
  }

  async connect (matcher, matchee) {
    try {
      await this.mail(matcher, matchee)
      await this.updateMailed(matcher, matchee)
    } catch (e) {
      console.error('Send email failed =====')
      console.error(e)
      console.error('=======================')
    }
  }

  async mail (matcher, matchee) {
    const payload = {
      to: matcher.email,
      from: 'ff@ff.com', // TODO our platform email here
      replyTo: matchee.email,
      subject: `Introduce ${matchee.name} to your today`,
      text: `Your ff is ${matchee.name}`,
      html: `<p> Your ff is ${matchee.name}</p>`
    }

    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    return fetch(MAIL_SERVICE_API, opt)
  }

  updateMailed (matcher, matchee) {
    this.dal.updateMailed(matcher._id, matchee._id)
  }
}

module.exports = (dal) => {
  return new Mailer(dal)
}
