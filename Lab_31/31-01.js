const TelegramBot = require('node-telegram-bot-api');
const token = "6599571016:AAHNLDBlvgbJgk-Vn35sz_DP9_y1E4XCWlo";

const bot = new TelegramBot(token, { polling: true });

bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, `echo: ${msg.text}`);
});

bot.on('polling_error', error => {
    console.log(`Telegram bot error: ${error}`);
});

console.log('Telegram bot is listening.');