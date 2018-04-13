const { lcsSubStr } = require('../../src/utils')

describe('utils', () => {
  it('should get length of longest common str of two strings', () => {
    const s1 = 'abc'
    const s2 = 'bcd'
    const len = lcsSubStr(s1, s2)
    expect(len).toBe(2)
  })
})
