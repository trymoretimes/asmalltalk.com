import { expect } from 'chai'
import {
  maybeEmailAddress,
  getSiteAndUserId
} from '../../src/utils'

describe('utils', () => {
  it('maybeEmailAddress', () => {
    let wrongEmail = 'abc'
    expect(maybeEmailAddress(wrongEmail)).to.equal(false)
    wrongEmail = ''
    expect(maybeEmailAddress(wrongEmail)).to.equal(false)
    let correctEmail = 'h.minghe@gmail.com'
    expect(maybeEmailAddress(correctEmail)).to.equal(true)
    correctEmail = 'hMing@qq.com'
    expect(maybeEmailAddress(correctEmail)).to.equal(true)
  })

  it('get site and username', () => {
    let str = 'metrue'
    let [site, username] = getSiteAndUserId(str)
    expect(site).to.equal('v2ex')
    expect(username).to.equal('metrue')

    str = 'github.com/metrue'
    let [site1, username1] = getSiteAndUserId(str)
    expect(site1).to.equal('github')
    expect(username1).to.equal('metrue')

    str = 'v2ex.com/metrue'
    let [site2, username2] = getSiteAndUserId(str)
    expect(site2).to.equal('v2ex')
    expect(username2).to.equal('metrue')
  })
})
