const puppeteer = require('puppeteer');
const url = 'https://www.net.city.nagoya.jp/cgi-bin/sp04001';
const mailClientRequest = require('request');

async function run() {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();
    await page.goto(url);

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
    await page.click('input[name="joken"][value="2"]');
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
        processContentForSending(data);
        return data;
    })
    // TODO: Change for API calls
    console.log(list);

    //await page.screenshot({path: 'screenshot.png'});
    browser.close();
}

//TODO follow future project
function processContentForSending(data) {

    if (hasNoChangesBetween(readData(), data)) {
        return;
    }

    // Mail main content
    body = {
        mailData : data,
    };

    request('http://localhost:3020/sendMail', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });

    // output data
    writeData(data);

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

//ouput the stringdata as text file
//and download it automatically
function outputDataText(stringData){
  let fetchData = document.createElement('a');
  fetchData.href = "data:application/octet-stream," + encodeURIComponent(stringData);
  fetchData.download = 'latestData.txt';
  //for auto download
  fetchData.click();
}

function writeData(data) {
    // output at ./output/output.txt and return true for succesful write
    return true;
}

function readData() {
    // reat ./output/output.txt
    return {};
}

module.exports.scrape = run;
