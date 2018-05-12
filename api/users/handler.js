const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const uuid = require('uuid')

const TableName = process.env.DYNAMODB_TABLE

const response = (err, data = {}, cb) => {
  const resp = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  }
  cb(err, resp)
}

const create = function (event, ctx, cb) {
  const data = JSON.parse(event.body)
  const email = data.email
  const username = data.username
  const site = data.site
  const story = data.story

  const id = uuid.v1()
  const updatedAt = new Date().getTime()

  const params = {
    TableName: TableName,
    Item: {
      email: email,
      username: username,
      site: site,
      story: story,
      id: id,
      updatedAt: updatedAt
    }
  }

  return dynamoDb.put(params, (error, data) => {
    response(error, params.Item, cb)
  })
}

const get = function (event, ctx, cb) {
  const id = event.pathParameters.id
  const params = {
    TableName: TableName,
    Key: {
      id: id
    }
  }

  return dynamoDb.get(params, (error, data) => {
    if (error) {
      cb(error)
    }
    response(error, data.Item, cb)
  })
}

const update = function (event, ctx, cb) {
  const data = JSON.parse(event.body)
  data.id = event.pathParameters.id
  data.updatedAt = new Date().getTime()

  const params = {
    TableName: TableName,
    Item: data
  }

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      cb(error)
    }
    response(error, data.Item, cb)
  })
}

module.exports = {
  create: create,
  get: get,
  update: update
}
