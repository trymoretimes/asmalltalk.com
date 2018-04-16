const sgMail = require('@sendgrid/mail')

const { delay } = require('../utils')

const SENDGRID_API_KEY = '***REMOVED***'
sgMail.setApiKey(SENDGRID_API_KEY)

const CHECK_INTERVAL = 1 * 3600 * 1000

class Mailer {
  constructor (dal, config = {}) {
    this.dal = dal
    this.config = config

    this.stopped = false
  }

  async start () {
    this.stopped = false

    while (!this.stopped) {
      await this.run()
      await delay(this.config.CHECK_INTERVAL || CHECK_INTERVAL)
    }
  }

  stop () {
    this.stopped = true
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
          const matchee = await this.dal.fetch(guyId)
          await this.connect(matcher, matchee)
          break
        }
      }
    }
  }

  async connect (matcher, matchee) {
    try {
      await this.mail(matcher, matchee)
      await this.dal.updateMailed(matcher._id.toString(), matchee._id.toString())
    } catch (e) {
      console.error('Send email failed =====')
      console.error(e)
      console.error('=======================')
    }
  }

  updateMailed (matcher, matchee) {
    this.dal.updateMailed(matcher._id, matchee._id)
  }

  async mail (matcher, matchee) {
    const payload = {
      to: matcher.email,
      from: 'hello@asmalltalk.com', // TODO our platform email here
      replyTo: matchee.email,
      subject: `小对话：为你推荐 V2EX 用户 ${matchee.name}`,
      text: `
          Hi ${matcher.username}，\n
          今天为你推荐的 V2EX 用户是 ${matchee.username}，以下是 Linus 的个人简介：\n\n

          Email: ${matchee.email} \n
          个人网站：\n
          Twitter:\n
          知乎账号：\n
          微信账号：\n
          V2EX 个人档案：https://www.v2ex.com/member/${matchee.username}\n\n

          Linus 擅长的事物：${matchee.canHelp}\n
          Linus 希望得到帮助的事物：${matchee.needHelp}\n

          想认识他？直接回复这封邮件跟他 say hi 吧。 \n

          小对话 \n

          更新你的档案：https://www.asmalltalk.com \n
          退订：https://www.asmalltalk.com \n
      `,
      html: `
          <p>
          Hi ${matcher.username}， \n
          今天为你推荐的 V2EX 用户是 ${matchee.username}，以下是 Linus 的个人简介： \n\n

          Email: ${matchee.email} \n
          个人网站： \n
          Twitter:\n
          知乎账号：\n
          微信账号：\n
          V2EX 个人档案：https://www.v2ex.com/member/${matchee.username}\n\n

          Linus 擅长的事物：${matchee.canHelp}\n
          Linus 希望得到帮助的事物：${matchee.needHelp}\n

          想认识他？直接回复这封邮件跟他 say hi 吧。\n\n

          小对话\n\n

          更新你的档案：https://www.asmalltalk.com\n\n
          退订：https://www.asmalltalk.com\n
          </p>
          `
    }

    await sgMail.send(payload)
    console.log(`mail send`)
  }
}

module.exports = (dal, config) => {
  return new Mailer(dal, config)
}
