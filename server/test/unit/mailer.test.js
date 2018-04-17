const setupMailer = require('../../src/jobs/mailer')
const { delay } = require('../../src/utils')

describe('mailer', () => {
  it('should run on interval set', async () => {
    const mailer = setupMailer(null, { CHECK_INTERVAL: 1000 })

    let count = 0
    mailer.run = () => {
      count++
    }

    expect(mailer.stopped).toBeFalsy()
    mailer.start()
    await delay(2000)
    expect(count).toEqual(2)
    mailer.stop()
    await delay(2000)
    expect(count).toEqual(2)
  })
})
