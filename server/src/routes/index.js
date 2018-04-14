const fetch = require('node-fetch')
const scrapeIt = require('scrape-it')
const urls = require('./urls')

async function getUserInfo (username) {
  const info = {}
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
        info.valid = data.status === 'found'
        info.bio = data.bio
        break
      } else {
        console.log(data.error, 'try next service: ', url.split('api')[0])
      }
    }
  }

  return info
}

async function spider (username) {
  const url = `https://www.v2ex.com/member/${username}`
  const info = { valid: false, bio: '' }

  const { data, response } = await scrapeIt(url, {
    profile: {
      listItem: '#Main .box .cell'
    }
  })
  if (response.statusCode === 200) {
    info.valid = true
    info.bio = data.profile[1] ? data.profile[1] : ''
  }
  return info
}

const generateCode = () => 'bz' + Math.floor(Math.random() * 10000)

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
        if (info.valid) {
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
        console.log(info)
        ctx.body = {
          valid: info.valid,
          code: info.valid ? generateCode() : ''
        }
      } else {
        ctx.status = 400
        ctx.body = { info: 'username missing' }
      }
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
        })
      } catch (e) {
        error = e
      }

      if (error === null) {
        ctx.status = 201
        ctx.body = { created: 'OK' }
      } else {
        ctx.status = 500
        ctx.message = `comment created met some errors: ${error}`
      }
    }
  },
  {
    path: '/users/:id',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      let error = null
      let user = null
      try {
        user = await dal.fetch(id)
      } catch (e) {
        error = e
      }

      if (error === null) {
        ctx.status = 200
        ctx.body = user
      } else {
        ctx.status = 500
        ctx.message = `errors: ${error}`
      }
    }
  },
  {
    path: '/users/:id',
    method: 'PUT',
    handler: async (ctx, dal) => {
      const { id } = ctx.params
      const { canHelp, needHelp, extraInfo } = ctx.request.body
      let error = null
      try {
        await dal.update({ id, canHelp, needHelp, extraInfo })
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
  }
]
