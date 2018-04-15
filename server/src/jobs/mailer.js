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
      from: 'hello@asmalltalk.com', // TODO our platform email here
      replyTo: matchee.email,
      subject: `小对话：今天为你推荐 V2EX 用户 ${matchee.name}`,
      text: `
          Hi ${matcher.name}，
          今天为你推荐的 V2EX 用户是 ${matchee.name}，以下是 Linus 的个人简介：

          Email: ${matchee.email}
          个人网站：
          Twitter: 
          知乎账号：
          微信账号：
          V2EX 个人档案：https://www.v2ex.com/member/${matchee.name}

          Linus 擅长的事物：iOS 开发，深圳房产投资
          Linus 希望得到帮助的事物：产品推广海外工作、留学咨询

          想认识他？直接回复这封邮件跟他 say hi 吧。

          小对话
      `,
      html: `
          <p>
          Hi ${matcher.name}，
          今天为你推荐的 V2EX 用户是 ${matchee.name}，以下是 Linus 的个人简介：

          Email: ${matchee.email}
          个人网站：
          Twitter: 
          知乎账号：
          微信账号：
          V2EX 个人档案：https://www.v2ex.com/member/${matchee.name}

          Linus 擅长的事物：iOS 开发，深圳房产投资
          Linus 希望得到帮助的事物：产品推广海外工作、留学咨询

          想认识他？直接回复这封邮件跟他 say hi 吧。

          小对话
          </p>
          `
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
