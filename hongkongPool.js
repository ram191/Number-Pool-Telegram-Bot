const hongkongScrape = require('./pageScraper');
async function scrapeSydneyPool(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await hongkongScrape.scraper(browser);
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeSydneyPool(browserInstance)