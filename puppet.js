const puppeteer = require('puppeteer');
const url = 'https://www.net.city.nagoya.jp/cgi-bin/sp04001';

async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: 'screenshot.png'});
    browser.close();
}
run();