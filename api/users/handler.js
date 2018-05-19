const sgMail = require('@sendgrid/mail')
const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const dynamoDb = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })
const uuid = require('uuid')

const TableName = process.env.DYNAMODB_TABLE

function sendWelcomeEmail (to) {
  const text = `
Hello, 朋友\r\n\r\n

感谢你使用 小对话, 你将会在24 小时之内收到你的第一个推荐好友，当然你及时的更新的个人信息，让 小对话 可以帮你更精确的找到好友。\r\n\r\n

如果你对 小对话 有任何的意见和建议，欢迎你随时回复这封邮件. \r\n\r\n

小对话团队 https://asmalltalk.com \r\n
`
  const html = `
Hello, 朋友 <br><br>

感谢你使用 小对话, 你将会在24 小时之内收到你的第一个推荐好友，当然你及时的更新的个人信息，让 小对话 可以帮你更精确的找到好友。<br><br>

如果你对 小对话 有任何的意见和建议，欢迎你随时回复这封邮件. <br><br>

小对话团队 https://asmalltalk.com <br>
`
  const payload = {
    to: to.email,
    from: process.env.ASMALLTALK_EMAIL, // TODO our platform email here
    replyTo: process.env.ASMALLTALK_EMAIL,
    subject: `欢迎来到小对话`,
    text,
    html
  }
  sgMail.send(payload)
}

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
  const story = data.story || ''

  const params = {
    TableName: TableName,
    FilterExpression: 'email = :email and username = :username and site = :site and story = :story',
    ExpressionAttributeValues: {
      ':email': email,
      ':username': username,
      ':site': site,
      ':story': story
    }
  }

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      cb(error)
    } else if (data.Items.length > 0) {
      response(error, data.Items[0], cb)
    } else {
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
        if (!error) {
          sendWelcomeEmail({ username: username, email: email })
        }
        response(error, params.Item, cb)
      })
    }
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
  const id = event.pathParameters.id
  const body = JSON.parse(event.body)
  const params = {
    TableName: TableName,
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  }

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      cb(error)
    } else if (data.Items.length > 0) {
      const item = data.Items[0]
      const params = {
        TableName: TableName,
        Key: {
          id: id
        },
        UpdateExpression: 'SET #story = :story, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#story': 'story',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':story': body.story || item.story,
          ':updatedAt': new Date().getTime()
        },
        ReturnValues: 'ALL_NEW'
      }
      return dynamoDb.update(params, (error, data) => {
        if (error) {
          cb(error)
        }
        response(error, data.Attributes, cb)
      })
    } else {
      response(error, { message: 'no such item with ' + id })
    }
  })
}

module.exports = {
  create: create,
  get: get,
  update: update
}
