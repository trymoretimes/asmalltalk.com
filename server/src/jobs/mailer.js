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
Hi ${matcher.username}，<br>
今天为你推荐的 V2EX 用户是 ${matchee.username}，以下是 Linus 的个人简介：<br><br>

Email: ${matchee.email} \r\n
个人网站：\r\n
Twitter:\r\n
知乎账号：\r\n
微信账号：\r\n
V2EX 个人档案：https://www.v2ex.com/member/${matchee.username}\r\n\r\n

Linus 擅长的事物：${matchee.canHelp}\r\n
Linus 希望得到帮助的事物：${matchee.needHelp}\r\n

想认识他？直接回复这封邮件跟他 say hi 吧。 \r\n

小对话 \r\n

更新你的档案：https://www.asmalltalk.com \r\n
退订：https://www.asmalltalk.com \r\n
      `,
      html: `
Hi ${matcher.username}， <br>
今天为你推荐的 V2EX 用户是 ${matchee.username}，以下是 Linus 的个人简介： <br><br>

Email: ${matchee.email} <br>
个人网站： <br>
Twitter:<br>
知乎账号：<br>
微信账号：<br>
V2EX 个人档案：https://www.v2ex.com/member/${matchee.username}<br><br>

Linus 擅长的事物：${matchee.canHelp}<br>
Linus 希望得到帮助的事物：${matchee.needHelp}<br>

想认识他？直接回复这封邮件跟他 say hi 吧。<br><br>

小对话<br><br>

更新你的档案：https://www.asmalltalk.com<br><br>
退订：https://www.asmalltalk.com<br>
          `
    }

    await sgMail.send(payload)
    console.log(`mail send`)
  }
}

module.exports = (dal, config) => {
  return new Mailer(dal, config)
}
