const pageScraper = require('./pageScraper');
async function scrape(browserInstance, pool){
    let browser;
    try{
        browser = await browserInstance;
        switch (pool) {
            case "sydney":
                return await pageScraper.sydneyScraper(browser);    
            case "hongkong":
                return await pageScraper.hongkongScraper(browser);
            default:
                break;
        }
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance, pool) => scrape(browserInstance, pool);
