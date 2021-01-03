const express = require('express');
const scraper = require('./index.js');

const app = express();

// Change to appropriate Endpoint API
app.get('/bbscraper', (req, res) => {
    scraper.scrape();
});

app.listen(3000, () => {
    console.log('App is listening on port 3000');
})