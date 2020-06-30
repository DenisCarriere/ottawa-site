import * as dotenv from "dotenv"
import Telegraf from 'telegraf';
import { CronJob } from "cron"
const commandParts = require('telegraf-command-parts');
const Markup = require('telegraf/markup')
import load from "load-json-file"
import write from "write-json-file"
import fs from "fs"
import fetch from "node-fetch"
import crypto from 'crypto';

// .env
dotenv.config();

// Telegram Bot
export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(commandParts());

const chat_ids = new Set<number>( fs.existsSync("chat_ids.json") ? load.sync("chat_ids.json") : [] );
const website_hashes = new Map<string, string>();
const urls = [
  "https://ottawa.ca/en/living-ottawa/laws-licences-and-permits/marriages-deaths-and-oaths",
  "https://ottawa.ca/en/client-services#closure-city-ottawa-client-service-centres"
]

/**
 * start - start monitoring process
 */
bot.command('/start', ctx => {
  ctx.reply(`✅ Enabled`, { parse_mode: "Markdown"});
  chat_ids.add( ctx.chat.id );
  write.sync("chat_ids.json", Array.from(chat_ids) )
})

new CronJob("*/10 * * * * *", async () => {
  for ( const url of urls ) {
    const response = await fetch(url);
    const text = (await response.text()).replace(/\s/g, "")

    // hashes
    const id = encode( url );
    const hash = encode( text );

    if ( website_hashes.has( id ) ) {
      for ( const chat_id of chat_ids ) {
        if ( website_hashes.get( id ) != hash ) {
          const msg = `❗️**Website changed**\n${url}`
          bot.telegram.sendMessage(chat_id, msg, { disable_web_page_preview: true, parse_mode: "Markdown"});
          console.log(msg);
        }
      }
    }
    console.log(id, hash);
    website_hashes.set( id, hash );
  }

}, null, true).fireOnTick();

bot.launch()

function encode( text: string ) {
  return crypto.createHash("md5").update(text).digest("hex");
}