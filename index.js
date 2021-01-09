// const scraper = require('./scraper/scraper.js');

// // Use only for testing
// // Official service calls moved to ./scraper/
// scraper.scrape();
const cron = require('./cron-job/cron');

cron.cronJob.start();