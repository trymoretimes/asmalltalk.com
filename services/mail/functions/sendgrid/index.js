const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = '***REMOVED***'
sgMail.setApiKey(SENDGRID_API_KEY)

// https://github.com/sendgrid/sendgrid-nodejs/blob/master/test/typescript/mail.ts
exports.handle = function (event, ctx, cb) {
  sgMail.send(event).then((result) => {
    cb(null, { status: 'sent mail' })
  }, (err) => {
    cb(err)
  })
}
