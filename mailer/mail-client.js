const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.ses.region
});

const ses = new AWS.SES({
    apiVerson: '2010-12-01'
});

// to, subject, message, from
const sendEmail = (mailData) => {
    const params = {
        Destination: {
            ToAddresses: [mailData.to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: mailData.message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: mailData.subject
            }
        },
        ReturnPath: mailData.from ? mailData.from : config.aws.ses.from.default,
        Source: mailData.from ? mailData.from : config.aws.ses.from.default
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack);
        } else {
            console.log("Email sent : ", data);
        }
    })
}

module.exports = { sendEmail };