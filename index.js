const puppeteer = require('puppeteer');
const url = 'https://www.net.city.nagoya.jp/cgi-bin/sp04001';

async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Select boxes
    await page.select('select[name="syumoku"]', '023');
    await page.select('select[name="month"]', '12');
    await page.select('select[name="day"]', '18');
    await page.select('select[name="kyoyo1"]', '07');
    await page.select('select[name="kyoyo2"]', '07');
    await page.select('select[name="chiiki"]', '20');
    await page.click('input[name="joken"][value="2"]');
    await page.click('input[type="submit"][name="button"]');

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
                'schedule': schedule.innerText

            });
        }
        return data;
    })
    console.log(list);

    //await page.screenshot({path: 'screenshot.png'});
    browser.close();
}
run();