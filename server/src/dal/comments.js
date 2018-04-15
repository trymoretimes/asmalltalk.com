const BaseDal = require('./base_dal')
const { ObjectID } = require('mongodb')

class Comments extends BaseDal {
  async create (obj) {
    const col = await this.collection()
    const ret = await col.insert(Object.assign({}, obj))
    return ret.ops[0]
  }

  async update (obj) {
    const { id, canHelp, needHelp, extraInfo } = obj
    const col = await this.collection()
    return col.updateOne({ _id: ObjectID(id) }, { $set: { canHelp, needHelp, extraInfo } })
  }

  async fetch (id) {
    const col = await this.collection()
    return col.findOne({ _id: ObjectID(id) })
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

  async updateMailed (id, mailedId) {
    const col = await this.collection()

    const emailed = await this.fetchMailedGuys(id) || []
    if (emailed.indexOf(mailedId) === -1) {
      emailed.push(mailedId)
    }

    return col.updateOne({ _id: id }, { $set: { emailed } })
  }

  async fetchMailedGuys (id) {
    const user = await this.findOne({ _id: id })
    if (user) {
      return user.emailed
    }

    throw new Error('no such user')
  }

  async fetchMatchGuys (id) {
    const user = await this.findOne({ _id: id })
    return user.matchGuys || []
  }
}

module.exports = Comments
