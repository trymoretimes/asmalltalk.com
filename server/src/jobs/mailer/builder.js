const MailTypes = {
  Plain: 'text',
  Html: 'html'
}

const buildSocialAccounts = (user, type = MailTypes.Plain) => {
  const { email, canHelp, needHelp } = user
  const { profile } = user
  const newLine = type === MailTypes.Plain ? '\r\n' : '<br>'

  const types = ['website', 'twitter', 'facebook', 'github']
  let body = `Email: ${email}${newLine}`
  types.forEach((t) => {
    if (profile[t]) {
      body += `${t}: ${profile[t]}${newLine}`
    }
  })
  if (canHelp && canHelp.length > 0) {
    body += `${profile.username} 擅长: ${user.canHelp}${newLine}`
  }
  if (needHelp && needHelp.length > 0) {
    body += `${profile.username} 希望: ${user.needHelp}${newLine}`
  }

  body += `V2EX 个人档案：https://www.v2ex.com/member/${profile.username}${newLine}${newLine}`
  return body
}

const build = (reciver, matcher) => {
  const textBody = buildSocialAccounts(matcher, MailTypes.Plain)
  const htmlBody = buildSocialAccounts(matcher, MailTypes.Html)
  return {
    text: `
Hi ${reciver.username}，<br>
今天为你推荐的 V2EX 用户是 ${matcher.username}，以下是 ${matcher.username} 的个人简介：<br><br>

${textBody}

想认识他？直接回复这封邮件跟他 say hi 吧。 \r\n

小对话 - ${(new Date).toISOString().substring(0, 10);}\r\n

更新你的档案：https://www.asmalltalk.com \r\n
 \r\n
`,
    html: `
Hi ${reciver.username}， <br>
今天为你推荐的 V2EX 用户是 ${matcher.username}，以下是 ${matcher.username} 的个人简介： <br><br>

${htmlBody}

想认识他？直接回复这封邮件跟他 say hi 吧。<br><br>

小对话<br><br>

更新你的档案：https://www.asmalltalk.com<br><br>
<a href="mailto:h.minghe@gmail.com?subject=退订?body=对 小对话 有什么建议吗">退订</a>
          `
  }
}

module.exports = build
