const puppeteer = require('puppeteer');
const mailClient = require('../mailer/mail-client');
const config = require('./config');
const fs = require('fs');
const { callbackify } = require('util');

async function run() {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();
    await page.goto(config.url.target);

    // current date
    let nodeDate = new Date();
    // adjust 0 before single digit date
    let date = ("0" + nodeDate.getDate()).slice(-2);
    // current month
    let month = ("0" + (nodeDate.getMonth() + 1)).slice(-2);

    // Select boxes
    await page.select('select[name="syumoku"]', '023');
    await page.select('select[name="month"]', month);
    await page.select('select[name="day"]', date);
    await page.select('select[name="kyoyo1"]', '07');
    await page.select('select[name="kyoyo2"]', '07');
    await page.select('select[name="chiiki"]', '20');
    await page.click('input[name="joken"][value="1"]');
    await page.click('input[type="submit"][name="button"]');

    // TODO: Change this deprecated method
    await page.waitFor(5000);

    const list = await page.evaluate(() => {
        let data = [];
        const list = document.querySelectorAll('.RESOUTPUT2');
        for (const a of list) {
            var schedule = a.nextElementSibling.nextElementSibling;
            data.push({
                'name': a.innerText,
                'link': a.querySelector('a').href,
                'date': a.nextElementSibling.innerText,
                'schedule': schedule.innerText,
            });
        }
        // Process result
        return data;
    }).then(value => {
        console.log(value);
        processContentForSending(value);
    });
    // TODO: Change for API calls
    console.log(list);

    // await page.screenshot({ path: 'screenshot.png' });
    browser.close();
}

//TODO follow future project
function processContentForSending(currentScrapedData) {
    readData(function(data) {
        if (hasChangesBetween(data, currentScrapedData)) {
            mailClient.sendEmail(createSendMailData(currentScrapedData));
            writeData(currentScrapedData);
        }
    });
}

//Old and New JSONData change check
function hasNoChangesBetween(oldData, newData) {
    return Object.keys(oldData).every(function (key) {
        if (newData[key] !== undefined
            && newData[key] === oldData[key]) {
            return true;
        }
    });
}

function hasChangesBetween(oldData, newData) {
    console.log(oldData);
    console.log(JSON.stringify(newData));
    return oldData !== JSON.stringify(newData)
}

function writeData(data) {
    fs.writeFile('./output/output.txt', JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
        console.log("Data has been written to file successfully.");
    });

    return true;
}

function readData(callback) {
    fs.readFile('./output/output.txt', (err, data) => {
        if (err) {
            throw err;
        }
        callback(data.toString());
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
