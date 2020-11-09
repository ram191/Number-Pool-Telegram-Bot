require('dotenv').config();

const scraperObject = {
    sydneyUrl: process.env.SYDNEY_URL,
    hongkongUrl: process.env.HONGKONG_URL,
    async sydneyScraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.sydneyUrl}...`);
        await page.goto(this.sydneyUrl);
        await page.waitForSelector('body > table:nth-child(8) > tbody > tr > td:nth-child(2) > iframe');
        var frames = await page.frames();
        var frame = frames.find(f => f.name() === "tempat");
        await frame.waitForSelector('body > table > tbody > tr:nth-child(2) > td > table > tbody');
        let urls = await frame.$$eval('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img', elem => {
            elem = elem.map(e => e.src);
            return elem;
        });

        var result = [];
        
        urls.forEach(url => {
            result.push(url.slice(-5, -4));
        });

        return result;
    },

    async hongkongScraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.hongkongUrl}`);
        await page.goto(this.hongkongUrl);
        await page.waitForSelector('body > center:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > table');
        let table = await page.$$('body > center:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > table > tbody > tr > td > div > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(4) > span');
        var result = [];
        for (let index = 0; index < table.length; index++) {
            var element = table[index];
            var element = await element.getProperty('textContent');
            var element = await element.jsonValue();
            result.push(element);
            if (index == table.length - 1)
            return result;
        }
    }
}
module.exports = scraperObject;