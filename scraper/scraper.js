const puppeteer = require('puppeteer');
const mailClient = require('../mailer/mail-client');
const config = require('./config');
const fs = require('fs');
const moment = require('./moment/moment');
const SEARCHABLE_DAYS = {
    SUN: 0,
    SAT: 6,
}

async function run() {

    console.log('Starting puppeteer...');
    //set maximum days to add
    const maxDays = 31;
    const listData = [];
    //get current date in YYYYMMDD format
    let currentDate = moment().format('YYYYMMDD');
    console.log('Opening browser...');
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    console.log('Browser opened...');
    const page = await browser.newPage();
    for (let day = 1; day <= maxDays; day++) {

        if (!isWeekend(currentDate)) {
            console.log("Skipping search...");
            continue;
        }
        console.log('Start schedule search at :' + currentDate.toString());
        // await page.goto(config.url.target);
        await page.goto(config.url.target,
            {
                waitUntil: 'load',
                timeout: 0
            });

        // Select boxes
        await page.select('select[name="syumoku"]', '023');
        await page.select('select[name="month"]', ('0' + moment(currentDate).format('MM'));
        await page.select('select[name="day"]', ('0' + moment(currentDate).format('DD'));
        await page.select('select[name="kyoyo1"]', '07');
        await page.select('select[name="kyoyo2"]', '07');
        await page.select('select[name="chiiki"]', '20');
        await page.click('input[name="joken"][value="1"]');
        await page.click('input[type="submit"][name="button"]');

        console.log('Starting loop through date...');

        // TODO: Change this deprecated method
        await page.waitForTimeout(5000);

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
            console.log("Processing...");
            // Process result
            return data;
        }).then(valueData => {
            if (valueData.length != 0) {
                const dayAsKey = 'day' + i;
                let dateValueMap = {};
                dateValueMap[dayAsKey] = valueData;
                processContentForSending(dayAsKey, valueData);
                listData.push(dateValueMap);
            }
            // await page.screenshot({ path: 'screenshot.png' });
        });
        currentDate =  moment(currentDate, 'YYYYMMDD').add(1,'days');
    }

    console.log('Browser closing...')
    page.close();
    browser.close();
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

    body += body.toString();

    return {
        to: toAddress,
        subject: subject,
        message: body
    };
}

function isWeekend(currentDate) {
    return moment(currentDate).isoWeekday() > 5;
}

module.exports.scrape = run;
