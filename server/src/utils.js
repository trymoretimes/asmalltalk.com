const uniqueNames = (emails) => {
  const names = []
  emails.forEach((email) => {
    let [name] = email.split('@')
    let suffix = 1
    while (names.indexOf(name) !== -1) {
      name = `${name}${suffix}`
      suffix += 1
    }
    names.push(name)
  })
  return names
}

const appendUniqueName = (comments) => {
  const ret = []
  const isUnique = (name, domain) => {
    for (const comment of ret) {
      const dm = comment.user.split('@')[1]
      if (comment.name === name && dm !== domain) return false
    }
    return true
  }

  for (const comment of comments) {
    const [name, domain] = comment.user.split('@')
    let suffix = 1
    let newName = name
    while (!isUnique(newName, domain)) {
      newName = `${name}${suffix}`
      suffix += 1
    }
    ret.push(Object.assign(comment, { name: newName }))
  }
  return ret
}

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

module.exports = {
  uniqueNames,
  appendUniqueName,
  lcsSubStr,
  delay
}
