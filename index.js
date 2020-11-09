require('dotenv').config();
const axios = require('axios');
const browserObject = require('./browser');
const scraper = require('./scrapeController');
const CronJob = require('cron').CronJob;
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN)
let browserInstance = browserObject.startBrowser();

var sydney;
var hongkong;

bot.launch();

var hongkongJob = new CronJob('* * * * *', function() {
    scraper(browserInstance, "hongkong").then((result) => {
        hongkong = result.slice(2, 6).toString().replace(/,/g, '');;
        bot.telegram.sendMessage('-427788730', `Hongkong updated! ${hongkong} \nDo you want to calculate the result? \n \n/calculateHongkong to calculate latest update.`);
    });
});

var sydneyJob = new CronJob('* * * * *', function() {
    scraper(browserInstance, "sydney").then((result) => {
        sydney = result.slice(2, 6).toString().replace(/,/g, '');
        bot.telegram.sendMessage('-427788730', `Sydney updated! ${sydney} \nDo you want to calculate the result? \n \n/calculateSydney to calculate latest update.`);
    });
});

bot.command('check', (ctx) => {
    ctx.reply(`Sydney = ${sydney}\nHongkong = ${hongkong}`);
});

bot.command('calculateSydney', (ctx) => {
    axios.post('http://localhost:1122/api/calculate', {
        pasaranId: 3,
        keluaran: sydney,
        token: process.env.BOT_TOKEN
    }).then(res => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
        ctx.reply(`The operation returned "${res.data}"`)
    }).catch(error => {
        console.error(error);
        ctx.reply("An error has occured when calculating")
    });
});

sydneyJob.start();
hongkongJob.start();