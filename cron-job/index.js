const cron = require('node-cron');
const express = require('express');

app = express();

cron.schedule('* * * * *', () => {
    console.log('Running a task every 10 minutes');
})

// Schedule runs at 8 AM every day? Verify cron tab syntax
cron.schedule('00 08 * * *', () => {
    // Add call for controller to run the scraper
});

app.listen(3000);