const fetch = require('node-fetch');
const auth = require('../auth')
const { setToken } = require('../token')
const CONFIG = require('../../config.json')

const YOYO_ADMIN_USERNAME = process.env.YOYO_ADMIN_USERNAME || CONFIG.env.YOYO_ADMIN_USERNAME
const YOYO_ADMIN_PASSWORD = process.env.YOYO_ADMIN_PASSWORD || CONFIG.env.YOYO_ADMIN_PASSWORD

async function isValidUser(username) {
  const url = `https://www.v2ex.com/api/members/show.json?username=${username}&timestamp=${Math.random()}`
  console.log(url)
  const resp = await fetch(url)
  const data = await resp.json()
  return data.status === 'found'
}

async function rigister(username, code) {
  const url = `https://www.v2ex.com/api/members/show.json?username=${username}&timestamp=${Math.random()}`
  const resp = await fetch(url);
  const data = resp.json();
  const { bio } = data;
  if (bio.contains(code)) {
    return true;
  }

  return false;
}

module.exports = [
  {
    path: '/health',
    method: 'GET',
    handler: async (ctx) => {
      ctx.body = 'OK'
    },
  },
  {
    path: '/users/valid',
    method: 'GET',
    handler: async (ctx, dal) => {
      const { userId } = ctx.request.query
      const valid = await isValidUser(userId)
      ctx.body = { valid }
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
        emailed,
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
          date: (new Date()).toISOString(),
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
    },
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
              date: (new Date()).toISOString(),
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
            date: (new Date()).toISOString(),
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
    },
  },
]
