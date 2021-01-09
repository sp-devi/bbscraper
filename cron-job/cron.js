const cron = require('node-cron');
const request = require('request');
const scraper = require('../scraper/scraper');

const cronJob = {
    start,
    end
};

function start() {
    scraper.scrape();
    // cron.schedule('0 */1 8-23 * * *', () => {
    //     const date = new Date();
    //     console.log("Running at : " + date.getHours() + "/ " + date.getMinutes());
    //     scraper.scrape();
    // });
}

function end() {
    // write end task function here
}

module.exports.cronJob = cronJob;