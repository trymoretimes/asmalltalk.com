const Koa = require('koa')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const logger = require('koa-logger')
const cors = require('koa-cors')
const serve = require('koa-static')

const routes = require('./routes')
const Dal = require('./dal')
const setupMailer = require('./jobs/mailer')
const Driver = require('./drivers/v2ex')

class Server {
  constructor (config) {
    this.config = config

    this.host = config.host || 'localhost'
    this.port = config.port || 5000

    this.dals = new Dal(config.mongo)

    this.app = new Koa()
    this.enableCORS()
    this.app.use(compress())
    this.app.use(logger())
    this.app.use(bodyParser())

    this.setupHandlers(config)

    // TODO testing on this
    const staticRoot = `${__dirname}/../public`
    this.app.use(serve(staticRoot))

    this.driver = new Driver()
    this.mailer = setupMailer(this.dals.comments, this.config.mailer)
  }

  setupHandlers () {
    const router = new Router({ prefix: '/v1/api' })

    routes.forEach((route) => {
      const handler = async (ctx) => {
        if (route.path && route.path.startsWith('/users')) {
          await route.handler(ctx, this.dals.comments, this.driver)
        }
      }

      switch (route.method) {
        case 'POST':
          router.post(route.path, handler)
          break
        case 'PUT':
          router.put(route.path, handler)
          break
        case 'DELETE':
          router.del(route.path, handler)
          break

        default:
          router.get(route.path, handler)
      }
    })

    this.app
      .use(router.routes())
      .use(router.allowedMethods())
  }

  enableCORS () {
    const options = {
      origin: (ctx) => {
        const origin = ctx.headers.origin
        //
        // if request with credentials, origin cannot be '*',
        // origin should be exactly the request origin
        //
        if (this.config.origins && this.config.origins.indexOf(origin) > -1) {
          return origin
        }
        return this.config.origins[0]
      },
      credentials: true
    }
    this.app.use(cors(options))
  }

  async start () {
    try {
      this._server = await this.app.listen(this.port)
      this.mailer.start()
    } catch (e) {
      console.warn(e)
    }
  }

  async stop () {
    await this._server.close()
  }
}

module.exports = Server
