const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = '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'
sgMail.setApiKey(SENDGRID_API_KEY)

// https://github.com/sendgrid/sendgrid-nodejs/blob/master/test/typescript/mail.ts
exports.handle = function (event, ctx, cb) {
  sgMail.send(event).then((result) => {
    cb(null, { status: 'sent mail' })
  }, (err) => {
    cb(err)
  })
}
