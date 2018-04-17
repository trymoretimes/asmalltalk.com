const buildBody = (method = 'GET', obj) => (
  {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }
)

module.exports = { buildBody }
