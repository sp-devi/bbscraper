const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mailClient = require('./mail-client');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

// Change to appropriate Endpoint API
app.get('/', (req, res) => {
    mailClient.sendEmail("ianemail@gmail.com", "Hey welcome", "Body of email");
    res.send('Email is sent');
});

app.listen(3000, () => {
    console.log('App is listening on port 3000');
})