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

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

module.exports = { lcsSubStr, delay }
