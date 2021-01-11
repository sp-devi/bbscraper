const cron = require('node-cron');
const scraper = require('../scraper/scraper');

const cronJob = {
    start,
    end
};

function start() {
    console.log("Starting cron job...");
    cron.schedule('0 */5 8-23 * * *', () => {
        const date = new Date();
        console.log("Running at : " + date.getHours() + ":" + date.getMinutes());
        scraper.scrape();
    });
}

function end() {
    // write end task function hereg
}

module.exports.cronJob = cronJob;