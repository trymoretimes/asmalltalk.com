export function maybeEmailAddress (email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function getSiteAndUserId (str) {
  if (str.includes('/')) {
    let [site, username] = str.split('/')
    if (site.includes('github')) {
      site = 'github'
    } else if (site.includes('v2ex')) {
      site = 'v2ex'
    }

    return [site, username]
  }
  return ['v2ex', str]
}
