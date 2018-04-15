const sgMail = require('@sendgrid/mail')
const SENDGRID_API_KEY = '***REMOVED***'
sgMail.setApiKey(SENDGRID_API_KEY)

const CHECK_INTERVAL = 1 * 3600 * 1000

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
        // TODO since objectID is object, should convert to string to do compare
        if (mailed.map(c => c.toString()).indexOf(guyId.toString()) === -1) {
          const matchee = await this.dal.findOne({ _id: guyId })
          await this.connect(matcher, matchee)
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

  updateMailed (matcher, matchee) {
    this.dal.updateMailed(matcher._id, matchee._id)
  }
}

module.exports = (dal) => {
  return new Mailer(dal)
}
