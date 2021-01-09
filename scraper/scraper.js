const puppeteer = require('puppeteer');
const mailClient = require('../mailer/mail-client');
const config = require('./config');
const fs = require('fs');

async function run() {

    console.log('Starting puppeteer...');

    const listData = [];

    // current date
    let nodeDate = new Date();
    // adjust 0 before single digit date
    let date = ("0" + nodeDate.getDate()).slice(-2);
    // current month
    let month = ("0" + (nodeDate.getMonth() + 1)).slice(-2);
    // last date of the month
    let lastDate = new Date(nodeDate.getFullYear(), nodeDate.getMonth() + 1, 0).getDate();
        // nodeDate.getDate() + 4
    for (let i = 13; i <= 13; i++) {

        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });

        console.log('Opening browser...');

        const page = await browser.newPage();
        // await page.goto(config.url.target);
        await page.goto('https://www.net.city.nagoya.jp/cgi-bin/sp04001');

        console.log('Browser opened.');

        // Select boxes
        await page.select('select[name="syumoku"]', '023');
        await page.select('select[name="month"]', month);
        await page.select('select[name="day"]', ('0' + i).slice(-2));
        await page.select('select[name="kyoyo1"]', '07');
        await page.select('select[name="kyoyo2"]', '07');
        await page.select('select[name="chiiki"]', '20');
        await page.click('input[name="joken"][value="1"]');
        await page.click('input[type="submit"][name="button"]');

        console.log('Starting loop through date');

        // TODO: Change this deprecated method
        await page.waitFor(3000);

        console.log('Start evaluate...');

        await page.evaluate(() => {
            let data = [];
            const list = document.querySelectorAll('.RESOUTPUT2');

            console.log('Evaluating...');

            for (const a of list) {
                var schedule = a.nextElementSibling.nextElementSibling;
                data.push({
                    'name': a.innerText,
                    'link': a.querySelector('a').href,
                    'date': a.nextElementSibling.innerText,
                    'schedule': schedule.innerText,
                });
            }
            console.log("Processing at day : ");
            // Process result
            return data;
        }).then(value => {
            if (value.length != 0) {
                let dayAsKey = 'day' + i;
                let dateValueMap = {};
                dateValueMap[dayAsKey] = value;
                processContentForSending(dayAsKey, value);
                listData.push(dateValueMap);
            }
            // await page.screenshot({ path: 'screenshot.png' });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            browser.close();
            console.log('Browser closing...')
            console.log("Finished");
        });
    }
}

//TODO follow future project
function processContentForSending(dayAsKey, currentScrapedData) {
    readData(dayAsKey, function (data) {
        if (hasChangesBetween(data, currentScrapedData)) {

            console.log('Has changes for ' + dayAsKey);

            mailClient.sendEmail(createSendMailData(currentScrapedData));
            writeData(dayAsKey, currentScrapedData);
        }
    });
}

function hasChangesBetween(oldData, newData) {
    return oldData !== JSON.stringify(newData)
}

function writeData(dayAsKey, data) {
    let outputFileName = dayAsKey + '.txt';
    fs.writeFile('./output/' + outputFileName, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
            throw err;
        }
        console.log("Data has been written to file successfully.");
    });
}

function readData(dayAsKey, toRead) {
    fs.readFile('./output/' + dayAsKey + '.txt', (err, data) => {
        if (err) {
            toRead({});
        } else {
            toRead(data.toString());
        }
    });
}

function createSendMailData(scheduleData) {
    const toAddress = config.mail.to;
    const subject = config.mail.subject;

    let body = `Found new schedule(s): <br>`;

    scheduleData.forEach((element, index) => {
        body += ` No : ${index + 1} <br>`;
        body += ` Name : ${element.name} <br>`;
        body += ` Link : ${element.link} <br>`;
        body += ` Date : ${element.date} <br>`;
        body += ` Time : ${element.schedule} <br><br>`;
    });

    return {
        to: toAddress,
        subject: subject,
        message: body
    };
}

module.exports.scrape = run;
