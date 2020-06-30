import * as dotenv from "dotenv"
import Telegraf from 'telegraf';
const commandParts = require('telegraf-command-parts');

// .env
dotenv.config();

// Telegram Bot
export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(commandParts());
