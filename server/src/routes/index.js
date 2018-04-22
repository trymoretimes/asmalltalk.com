const fetch = require('node-fetch')
const { ourEmail } = require('../../config.json')
const driver = require('../drivers')
const mailer = require('../sendgrid')

async function welcomeEmail (to) {
  const text = `
Hi, ${to.username} \r\n\r\n

感谢你使用 小对话, 你将会在24 小时之内收到你的第一个推荐好友，当然你及时的更新的个人信息，让 小对话 可以帮你更精确的找到好友。\r\n\r\n

如果你对 小对话 有任何的意见和建议，欢迎你随时回复这封邮件. \r\n\r\n

小对话团队 https://asmalltalk.com \r\n
`
  const html = `
Hi, ${to.username} <br><br>

感谢你使用 小对话, 你将会在24 小时之内收到你的第一个推荐好友，当然你及时的更新的个人信息，让 小对话 可以帮你更精确的找到好友。<br><br>

如果你对 小对话 有任何的意见和建议，欢迎你随时回复这封邮件. <br><br>

小对话团队 https://asmalltalk.com <br>
`
  const payload = {
    to: to.email,
    from: ourEmail, // TODO our platform email here
    replyTo: ourEmail,
    subject: `欢迎来到小对话`,
    text,
    html
  }
  await mailer.send(payload)
}

const generateCode = (username, email) => 'bz' + Buffer.from(`${username}-${email}`).toString('base64').substr(1, 8)

const getSiteAndUserId = (str) => {
  if (str.includes('/')) {
     return str.split('/')
  }
  return ['v2ex', str]
}

module.exports = [
  {
    path: '/health',
    method: 'GET',
    handler: async (ctx) => {
      ctx.body = 'OK'
    }
  },
  {
    path: '/users/verifycode',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { userId, code } = ctx.request.query
      const [site, username] = getSiteAndUserId(userId)
      if (site && username && code) {
        const info = await driver.getUserProfile(site, username)
        if (info.status === 'found') {
          ctx.status = 200
          ctx.body = { verified: info.bio.includes(code) }
        } else {
          ctx.status = 200
          ctx.body = { verified: false, info: 'username is not valid' }
        }
      } else {
        ctx.status = 400
        ctx.body = { info: 'username missing' }
      }
    }
  },
  {
    path: '/users/valid',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { userId } = ctx.request.query
      const [site, username] = getSiteAndUserId(userId)
      if (userId) {
        const valid = await driver.isValidUser(site, username)
        ctx.body = { valid }
      } else {
        ctx.status = 400
        ctx.body = { info: 'username missing' }
      }
    }
  },
  {
    path: '/users/code',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { username, email } = ctx.request.query
      const code = generateCode(username, email)
      ctx.body = { code, username, email }
    }
  },
  {
    path: '/users',
    method: 'GET',
    handler: async (ctx, dal) => {
      const query = ctx.query
      const users = await dal.find(query)
      ctx.body = users
    }
  },
  {
    path: '/users',
    method: 'POST',
    handler: async (ctx, dal) => {
      const {
        email,
        needHelp,
        canHelp
      } = ctx.request.body
      let { username } = ctx.request.body

      if (!username || !email) {
        ctx.status = 400
        ctx.body = { error: 'both username and email needed' }

        return
      }

      const [site, userId] = getSiteAndUserId(username)
      const isValid = await driver.isValidUser(site, userId)
      if (!isValid) {
        ctx.status = 400
        ctx.body = { error: `${username} is not a valid v2ex user` }

        return
      }

      const users = await dal.find({ userId, email })
      if (users.length > 0) {
        ctx.status = 409
        const user = users[0]
        ctx.body = { ...user, message: 'user already existed' }

        return
      }

      const profile = await driver.getUserProfile(site, userId)
      const user = await dal.create({
        username: userId,
        email,
        needHelp,
        canHelp,
        matchGuys: [],
        emailed: [],
        profile,
        date: (new Date()).toISOString()
      })
      await welcomeEmail({ username: userId, email })
      ctx.cookies.set('asmalltalk-email', email, { httpOnly: false, maxAge: 10 * 24 * 3600 * 1000 })
      ctx.status = 201
      ctx.body = { ...user, message: 'registration successfully' }
    }
  },
  {
    path: '/users/:id',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      const user = await dal.fetch(id)
      ctx.body = user
    }
  },
  {
    path: '/users/:id',
    method: 'PUT',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      const obj = ctx.request.body
      let error = null
      try {
        await dal.update({ ...obj, id })
      } catch (e) {
        error = e
      }

      if (error === null) {
        ctx.status = 204
      } else {
        ctx.status = 500
        ctx.message = `user update met some errors: ${error}`
      }
    }
  },
  {
    path: '/users/:id',
    method: 'DELETE',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      // TODO just make it work
      const { code } = ctx.request.body
      if (code !== 'iamtheking') {
        ctx.status = 403
        ctx.body = 'fuck away please'

        return
      }


      let error = null
      try {
        await dal.delete(id)
      } catch (e) {
        error = e
      }

      if (error === null) {
        ctx.status = 200
        ctx.body = { status: `${id} deleted` }
      } else {
        ctx.status = 500
        ctx.message = `errors: ${error}`
      }
    }
  }
]
