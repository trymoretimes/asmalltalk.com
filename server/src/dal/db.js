const { MongoClient } = require('mongodb')

class Mongo {
  constructor () {
    this.client = null
    this.db = null
  }

  async connect (url, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) {
          reject(err)
        } else {
          this.client = client
          this.db = client.db(dbName)
          resolve(this.client)
        }
      })
    })
  }

  isConnected () {
    return this.db !== null
  }

  collection (name) {
    const col = this.db.collection(name)
    return col
  }

  async close () {
    await this.client.close()
    this.db = null
  }

  async _dropDB () {
    await this.db.dropDatabase()
  }
}

module.exports = new Mongo()
