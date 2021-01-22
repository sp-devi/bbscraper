const puppeteer = require('puppeteer');
const mailClient = require('../mailer/mail-client');
const config = require('./config');
const fs = require('fs');

const SEARCHABLE_DAYS = {
    SUN: 0,
    SAT: 6,
}

async function run() {

    console.log('Starting puppeteer...');

    const listData = [];

    // current date
    let nodeDate = new Date();
    // adjust 0 before single digit date
    let startDate = nodeDate.getDate();
    // current month
    let month = ("0" + (nodeDate.getMonth() + 1)).slice(-2);
    // last date of the month
    let lastDate = new Date(nodeDate.getFullYear(), nodeDate.getMonth() + 1, 0).getDate();

    console.log('Opening browser...');

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    console.log('Browser opened...');

    const page = await browser.newPage();
    //Month is only neded to be  declared once since initial is current month
    let currentMonthOrNext = nodeDate.getMonth();
    currentMonthOrNext = currentMonthOrNext + 1;
    for (let day = startDate; day <= lastDate; day++) {
         //tofllow
        //if (day < startDate) {
            // Proceed to next month
          //  console.log("Proceed search on to the next month");

        //}
        let futureDate = new Date(nodeDate.getFullYear(), currentMonthOrNext, day);
        if (!isToBeSearch(futureDate)) {
            console.log("Skipping search...");
            continue;
        }

        console.log('Start schedule search at :' + futureDate.toString());
        // await page.goto(config.url.target);
        await page.goto(config.url.target,
            {
                waitUntil: 'load',
                timeout: 0
            });

        // Select boxes
        await page.select('select[name="syumoku"]', '023');
        await page.select('select[name="month"]', ('0' + currentMonthOrNext).slice(-2));
        await page.select('select[name="day"]', ('0' + futureDate.getDay()).slice(-2));
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

function isToBeSearch(futureDate) {
    switch (futureDate.getDay()) {
        case SEARCHABLE_DAYS.SUN:
        case SEARCHABLE_DAYS.SAT:
            return true;
        default:
            return false;
    }
}

module.exports.scrape = run;
