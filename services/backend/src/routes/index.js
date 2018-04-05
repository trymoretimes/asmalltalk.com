const fetch = require('node-fetch')

async function isValidUser (username) {
  const url = `https://www.v2ex.com/api/members/show.json?username=${username}&timestamp=${Math.random()}`
  console.log(url)
  const resp = await fetch(url)
  const data = await resp.json()
  return data.status === 'found'
}

async function isValidCode (username, code) {
  const url = `https://www.v2ex.com/api/members/show.json?username=${username}&timestamp=${Math.random()}`
  const resp = await fetch(url)
  const data = await resp.json()
  const { bio } = data
  if (bio && bio.includes(code)) {
    return true
  }

  return false
}

const generateCode = () => Math.floor(Math.random() * 10000)

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
      let isVerifiedUser = false
      if (userId && code) {
        isVerifiedUser = await isValidCode(userId, code)
      }
      ctx.body = { verified: isVerifiedUser }
    }
  },
  {
    path: '/users/valid',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { userId } = ctx.request.query
      const valid = await isValidUser(userId)
      const code = generateCode()
      ctx.body = { valid, code }
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
    handler: async (ctx, dal, hooks) => {
      const {
        userId,
        email,
        needHelp,
        canHelp,
        keywords,
        matchGuys,
        emailed
      } = ctx.request.body

      let error = null
      try {
        await dal.create({
          userId,
          email,
          needHelp,
          canHelp,
          keywords,
          matchGuys,
          emailed,
          date: (new Date()).toISOString()
        }, hooks)
      } catch (e) {
        error = e
      }

      if (error === null) {
        ctx.status = 201
        ctx.body = Math.random()
      } else {
        ctx.status = 500
        ctx.message = `comment created met some errors: ${error}`
      }
    }
  },
  {
    path: '/users',
    method: 'PUT',
    handler: async (ctx, dal, hooks) => {
      const { user, uri, text, parents } = ctx.request.body

      let error = null
      if (parents && parents.length > 0) {
        for (const parent of parents) {
          try {
            await dal.create({
              user,
              uri,
              text,
              parent,
              date: (new Date()).toISOString()
            }, hooks)
          } catch (e) {
            error = e
          }
        }
      } else {
        try {
          await dal.create({
            user,
            uri,
            text,
            date: (new Date()).toISOString()
          }, hooks)
        } catch (e) {
          error = e
        }
      }

      if (error === null) {
        ctx.status = 201
      } else {
        ctx.status = 500
        ctx.message = `comment created met some errors: ${error}`
      }
    }
  }
]
