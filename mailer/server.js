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
    // TODO email should be passed as a request parameter
    mailClient.sendEmail("apldante@gmail.com", "AWS TESTING", "This is body");
    res.send('Email is sent');
});

app.listen(3020, () => {
    console.log('App is listening on port 3020');
})