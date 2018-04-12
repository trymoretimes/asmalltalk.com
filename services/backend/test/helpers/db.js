const MongoClient = require('mongodb').MongoClient

class Database {
  constructor () {
    this.db = null
    this.collection = null
  }

  async init (options) {
    if (this.db === null) {
      const { uri, db } = options
      const client = await MongoClient.connect(uri)
      this.db = client.db(db)
    }

    const { collection } = options
    if (this.collection === null) {
      this.collection = this.db.collection(collection)
    }
  }
}

module.exports = Database
