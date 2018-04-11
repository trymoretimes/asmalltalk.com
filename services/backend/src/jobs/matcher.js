const lcsSubStr = (s1, s2) => {
  const len1 = s1.length
  const len2 = s2.length
  const lcsuff = []
  for (let i = 0; i <= len1; i++) {
    lcsuff[i] = []
    for (let j = 0; j <= len2; j++) {
      lcsuff[i][j] = 0
    }
  }

  let ret = 0
  for (let i = 0; i <= len1; i++) {
    for (let j = 0; j <= len2; j++) {
      if (i === 0 || j === 0) {
        lcsuff[i][j] = 0
      } else if (s1[i - 1] === s2[j - 1]) {
        lcsuff[i][j] = lcsuff[i - 1][j - 1] + 1
        ret = Math.max(ret, lcsuff[i][j])
      } else {
        lcsuff[i][j] = 0
      }
    }
  }
  return ret
}

class ScoreMatrix {
  constructor () {
    this.matrix = {}
  }

  get (id1, id2) {
    return this.matrix[id1][id2]
  }

  set (id1, id2, val) {
    if (!this.matrix[id1]) {
      this.matrix[id1] = {}
    }
    if (!this.matrix[id2]) {
      this.matrix[id2] = {}
    }

    this.matrix[id1][id2] = val
    this.matrix[id2][id1] = val
  }
}

class Matcher {
  constructor (dal) {
    this.dal = dal
    this.scoreMatrix = new ScoreMatrix()
  }

  async run () {
    const users = await this.dal.find()

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        const user1 = users[i]
        const user2 = users[j]
        const score = this.calculate(user1, user2)
        this.scoreMatrix.set(user1._id, user2._id, score)
      }
    }
  }

  calculate (a, b) {
    const score1 = lcsSubStr(a.canHelp || '', b.needHelp || '')
    const score2 = lcsSubStr(a.needHelp || '', b.canHelp || '')
    return score1 + score2
  }

  start () {

  }
}

module.exports = (dal) => {
  return new Matcher(dal)
}
