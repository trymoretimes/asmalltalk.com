const BaseDal = require('./base_dal')

class Comments extends BaseDal {
  async create (obj) {
    let comment = Object.assign({}, obj)
    const col = await this.collection()
    await col.insert(comment)
  }

  async queryWithUri (q = {}) {
    const page = parseInt(q.page, 10) || 0
    const limit = parseInt(q.limit, 10) || 100
    const skip = page * limit

    const col = await this.collection()
    return col.find({ uri: { $regex: `${q.uri}` } })
              .skip(skip)
              .limit(limit)
              .toArray()
  }

  async updateMatchGuys (id, matchId) {
    const col = await this.collection()

    const matchGuys = await this.fetchMatchGuys(id)
    if (matchGuys.indexOf(matchId) === -1) {
      matchGuys.push(matchId)
    }

    return col.updateOne({ _id: id }, { $set: { matchGuys } })
  }

  async fetchMatchGuys (id) {
    const user = await this.findOne({ _id: id })
    if (user) {
      return user.matchGuys
    }

    throw new Error('no such user')
  }
}

module.exports = Comments
