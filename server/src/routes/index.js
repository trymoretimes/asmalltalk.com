const fetch = require('node-fetch')
const urls = require('./urls')

async function getUserInfo (username) {
  for (const url of urls) {
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username })
    }
    const resp = await fetch(url, opt)
    // TODO refactor needed
    if (resp.status === 200) {
      const data = await resp.json()
      if (!data.error) {
        return data
      } else {
        console.log(data.error, 'try next service: ', url.split('api')[0])
      }
    }
  }

  return {}
}

const generateCode = (username, email) => 'bz' + Buffer.from(`${username}-${email}`).toString('base64').substr(1, 8)

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
      if (userId && code) {
        const info = await getUserInfo(userId)
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
      if (userId) {
        const info = await getUserInfo(userId)
        ctx.body = info
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
    handler: async (ctx, dal, driver) => {
      const {
        username,
        email,
        needHelp,
        canHelp,
        extraInfo,
        matchGuys
      } = ctx.request.body

      if (!username || !email) {
        ctx.status = 400
        ctx.body = { message: 'both username and email needed'}

        return
      }

      const users = await dal.find({ username, email })
      if (users.length > 0) {
        ctx.status = 409
        return
      }

      const isValid = await driver.isValidUser(username)
      if (!isValid) {
        ctx.status = 400
        ctx.body = { message: `${username} is not a valid v2ex user`}

        return
      }

      const profile = await driver.getUserProfile(username)
      const user = await dal.create({
        username,
        email,
        needHelp,
        canHelp,
        matchGuys: matchGuys || [],
        emailed: [],
        profile,
        date: (new Date()).toISOString()
      })
      ctx.cookies.set('asmalltalk-email', email, { httpOnly: false, maxAge: 10 * 24 * 3600 * 1000 })
      ctx.status = 201
      ctx.body = user
    }
  },
  {
    path: '/users/:id',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      console.log(typeof id, id)
      const user = await dal.fetch(id)
      ctx.body = user
    }
  },
  {
    path: '/users/:id',
    method: 'PUT',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      const { canHelp, needHelp, matchGuys } = ctx.request.body
      let error = null
      try {
        await dal.update({ id, canHelp, needHelp, matchGuys })
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
