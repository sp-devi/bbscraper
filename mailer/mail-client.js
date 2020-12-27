const AWS = require('aws-sdk');

// For Email sending
const EMAIL = "apd@gmail.com"

AWS.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.ses.region
});

const ses = new AWS.SES({
    apiVerson: '2010-12-01'
});

const sendEmail = (to, subject, message, from) => {
    const params = {
        Destination: {
            ToAddress: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: from ? from : config.aws.ses.from.defaul,
        Source: from ? from : config.aws.ses.from.defaul
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack);
        } else {
            console.log("Email send : ", data);
        }
    })
}

module.exports = { sendEmail };