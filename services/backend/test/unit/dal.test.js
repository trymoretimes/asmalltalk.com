// TODO
// this is a serious issue between /lib and /src (need to figrure out)
const Dal = require('../../src/dal')
const { mockUser } = require('../helpers/mock')
const Database = require('../helpers/db')

describe('Dal', () => {
  describe('Users', () => {
    let dal = null
    let database = null

    const config = {
      host: 'localhost',
      port: 27017,
      db: 'YoYo-test'
    }

    beforeAll(async () => {
      dal = (new Dal(config)).comments
      database = new Database()
      await database.init({
        ...config,
        collection: 'Comments'
      })
    })

    it('create -> fetch matchGuys -> updateMatchGuys', async () => {
      const obj = mockUser()
      await dal.create({ ...obj })

      const ret = await database.collection.find(obj).toArray()
      // eslint-disable-next-line
      console.log(ret)
      const { _id, ...createdUser } = ret[0]
      expect(createdUser).toEqual(obj)

      const matchGuys = await dal.fetchMatchGuys(_id)
      expect(matchGuys).toEqual([])

      const matchId = Math.random()
      await dal.updateMatchGuys(_id, matchId)

      const newMatchGuys = await dal.fetchMatchGuys(_id)
      expect(newMatchGuys).toEqual([matchId])
    })

    it('create -> fetch emailed -> update emailed', async () => {
      const obj = mockUser()
      await dal.create({ ...obj })

      const ret = await database.collection.find(obj).toArray()
      // eslint-disable-next-line
      const { _id, ...createdUser } = ret[0]
      expect(createdUser).toEqual(obj)

      const emailed = await dal.fetchMailedGuys(_id)
      expect(emailed).toEqual([])

      const matchId = Math.random()
      await dal.updateMailed(_id, matchId)

      const newEmailed = await dal.fetchMailedGuys(_id)
      expect(newEmailed).toEqual([matchId])
    })

    afterAll(async () => {
      await database.collection.remove()
      await database.db.close()
    })
  })
})
