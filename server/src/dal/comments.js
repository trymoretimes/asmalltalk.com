const BaseDal = require('./base_dal')
const { ObjectID } = require('mongodb')

const buildObj = (srcObj, allowedFields = []) => {
  const obj = {}
  for (const f of allowedFields) {
    if (allowedFields.indexOf(f) !== -1 && srcObj[f] !== undefined && srcObj[f] !== null) {
      obj[f] = f === '_id' ? ObjectID(srcObj[f]) : srcObj[f]
    }
  }

  return obj
}

const buidQuery = (query = {}) => {
  const allowedFields = ['_id', 'username', 'email', 'site']
  return buildObj(query, allowedFields)
}

const buildUpdateObj = (obj = {}) => {
  const allowedFields = ['matchGuys', 'emailed', 'canHelp', 'needHelp', 'lastEmailAt', 'company']
  return buildObj(obj, allowedFields)
}

class Comments extends BaseDal {
  async create (obj) {
    const col = await this.collection()
    const ret = await col.insert(Object.assign({}, obj))
    return ret.ops[0]
  }

  async update (obj) {
    const col = await this.collection()
    return col.updateOne({ _id: ObjectID(obj.id) }, { $set: buildUpdateObj(obj) })
  }

  async fetch (id) {
    const col = await this.collection()
    return col.findOne({ _id: ObjectID(id) })
  }

  async delete (id) {
    const col = await this.collection()
    return col.deleteOne({ _id: ObjectID(id) })
  }

  async find (query = {}) {
    const page = parseInt(query.page, 10) || 0
    const limit = parseInt(query.limit, 10) || 100
    const skip = page * limit
    const col = await this.collection()
    return col.find(buidQuery(query))
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

    return col.updateOne({ _id: ObjectID(id) }, { $set: { matchGuys } })
  }

  async updateMailed (id, mailedId) {
    const col = await this.collection()

    const emailed = await this.fetchMailedGuys(id)
    if (emailed.indexOf(mailedId) === -1) {
      emailed.push(mailedId)
    }

    return col.updateOne({ _id: ObjectID(id) }, { $set: { emailed } })
  }

  async fetchMailedGuys (id) {
    const user = await this.findOne({ _id: ObjectID(id) })
    return user.emailed
  }

  async fetchMatchGuys (id) {
    const user = await this.findOne({ _id: ObjectID(id) })
    return user.matchGuys || []
  }
}

module.exports = Comments
