const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mailClient = require('./mail-client');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Change to appropriate Endpoint API
app.post('/sendMail', (req, res) => {
    console.log(JSON.stringify(req.body));
    console.log(createSendMailData(req.body));
    // mailClient.sendEmail("apldante@gmail.com", "AWS TESTING", "This is body");
    // res.send('Email is sent');
});

app.listen(3020, () => {
    console.log('App is listening on port 3020');
});

function createSendMailData(mailData) {
    let content = `Found new schedule(s): \n`;

    mailData.forEach((element, index) => {
        content += ` No : ${index + 1} \n`;
        content += ` Name : ${element.name} \n`;
        content += ` Link : ${element.link} \n`;
        content += ` Date : ${element.date} \n`;
        content += ` Time : ${element.schedule} \n\n`;
    });

    return content;
}