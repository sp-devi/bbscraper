const cron = require('node-cron');
const request = require('request');
const scraper = require('../scraper/scraper');

const cronJob = {
    start,
    end
};

function start() {
    cron.schedule('0 */1 8-23 * * *', () => {
        const date = new Date();
        console.log("Running at : " + date.getHours() + "/ " + date.getMinutes());
        scraper.scrape();
    });
}

function end() {
    // write end task function here
}

function doRequestJob() {
    request('http://localhost:3010/bbscraper', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    });
}

module.exports.cronJob = cronJob;