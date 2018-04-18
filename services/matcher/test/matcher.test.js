const Matcher = require('../src')
const config = require('../config.json')
const { delay } = require('../src/utils')

describe('matcher', () => {
  it('should run on interval set', async () => {
    const matcher = new Matcher({ ...config, CHECK_INTERVAL: 100 })

    let count = 0
    matcher.run = () => {
      count++
    }

    expect(matcher.stopped).toBeFalsy()
    matcher.start()
    await delay(500)
    expect(count).toEqual(5)
    matcher.stop()
    expect(matcher.stopped).toBeTruthy()
    await delay(500)
    expect(count).toEqual(5)
  }, 2000)
})
