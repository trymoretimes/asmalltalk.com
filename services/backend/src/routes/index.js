const fetch = require('node-fetch')
const scrapeIt = require('scrape-it')

async function getUserInfo (username) {
  const url = `https://www.v2ex.com/api/members/show.json?username=${username}&timestamp=${Math.random()}`
  const resp = await fetch(url)
  const info = { valid: false, bio: '' }
  if (resp.status === 200) {
    const data = await resp.json()
    console.log(resp, data)
    info.valid = data.status === 'found'
    info.bio = data.bio
  } else {
    const sInfo = await spider(username)
    info.valid = sInfo.valid
    info.bio = sInfo.bio
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
    info.bio = data.profile[1]
  }
  return info
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
        ctx.body = { created: 'OK' }
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
