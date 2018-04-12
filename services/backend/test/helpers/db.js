const MongoClient = require('mongodb').MongoClient

class Database {
  constructor () {
    this.db = null
    this.collection = null
  }

  async init (options) {
    if (this.db === null) {
      const { host, port, db } = options
      const client = await MongoClient.connect(`mongodb://${host}:${port}`)
      this.db = client.db(db)
    }

    const { collection } = options
    if (this.collection === null) {
      this.collection = this.db.collection(collection)
    }
  }
}

module.exports = Database
