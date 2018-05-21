const MailTypes = {
  Plain: 'text',
  Html: 'html'
}

const buildBody = (user, type = MailTypes.Plain) => {
  const { email, company, story } = user
  const { profile } = user
  const newLine = type === MailTypes.Plain ? '\r\n' : '<br>'

  let body = `Email: ${email}${newLine}`
  if (company) {
    body += `公司及职位：${company}`
  }

  if (profile) {
    if (profile.login) {
      body += `个人档案：https://github.com/${profile.login}${newLine}${newLine}`
    } else {
      body += `个人档案：https://www.v2ex.com/member/${profile.username}${newLine}${newLine}`
    }
  }

  if (story.length > 0) {
    body += `关于: ${story}`
  }

  return body
}

const build = (reciver, matcher) => {
  const textBody = buildBody(matcher, MailTypes.Plain)
  const htmlBody = buildBody(matcher, MailTypes.Html)
  return {
    text: `
Hi ${reciver.username}，\r\n
今天为你推荐的是 ${matcher.username}，以下是 ${matcher.username} 的个人简介：<br><br>

${textBody}

想认识他？直接回复这封邮件跟他 say hi 吧。 \r\n

小对话 - ${(new Date()).toISOString().substring(0, 10)}\r\n

更新你的档案：https://asmalltalk.com/#/users/${reciver._id} \r\n
 \r\n
`,
    html: `
Hi ${reciver.username}， <br>
今天为你推荐的是 ${matcher.username}，以下是 ${matcher.username} 的个人简介： <br><br>

${htmlBody}

想认识他？直接回复这封邮件跟他 say hi 吧。<br><br>

小对话<br><br>

更新你的档案：https://asmalltalk.com/#/users/${reciver._id} <br><br>
<a href="mailto:h.minghe@gmail.com?subject=退订&body=对 小对话 有什么建议吗">退订</a><br>
          `
  }
}

module.exports = build
