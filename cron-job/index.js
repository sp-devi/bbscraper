const cron = require('node-cron');
const express = require('express');
const request = require('request');

app = express();

cron.schedule('* * * * *', () => {
    console.log('Running a task every 10 minutes');
})

// Schedule runs at 8 AM every day? Verify cron tab syntax
cron.schedule('00 08 * * *', () => {
    // Add call for controller to run the scraper
    request('http://localhost:3010/bbscraper', function (error, response, body) {
       if (!error && response.statusCode == 200) {
          console.log(body)
       }
    })
});

app.listen(3000);