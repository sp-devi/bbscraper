const cron = require('node-cron');
const express = require('express');

app = express();

cron.schedule('* * * * *', () => {
    console.log('Running a task every 10 minutes');
})

app.listen(3000);