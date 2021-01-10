const cron = require('node-cron');
const scraper = require('../scraper/scraper');

const cronJob = {
    start,
    end
};

function start() {
    cron.schedule('0 */6 8-23 * * *', () => {
        const date = new Date();
        console.log("Running at : " + date.getHours() + ":" + date.getMinutes());
        scraper.scrape();
    });
}

function end() {
    // write end task function hereg
}

module.exports.cronJob = cronJob;