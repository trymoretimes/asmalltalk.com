const safeGet = (obj = {}, paths = []) =>
  paths.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, obj)

const response = (err, status, obj = {}, cb) => {
  const resp = {
    statusCode: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(obj)
  }
  cb(err, resp)
}

module.exports = {
  safeGet: safeGet,
  response: response
}

