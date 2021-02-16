const cron = require('node-cron');
const scraper = require('../scraper/scraper');
const config = require('./config');

const cronJob = {
    start,
    end
};

function start() {
    console.log("Starting cron job...");
    cron.schedule(writeCronExpression(), () => {
        const date = new Date();
        console.log("Cron running at " + date.toString());
        scraper.scrape();
    }, {
        timezone: "Asia/Tokyo"
    });

}

function writeCronExpression() {
    let expression = '';

    for (let field in config.cron_field) {
        expression += ' ' + config.cron_field[field];
    }

    return expression.trim();
}

function end() {
    // write end task function hereg
}

start();

module.exports.cronJob = cronJob;