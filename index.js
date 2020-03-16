const Discord = require("discord.js")
const client = new Discord.Client()
const debug = require('./src/lib/debug.js')
const main = require('./src/main.js')
const config = require("./data/config.js")
const store = require("./src/store.js")

const bot = {}
bot.setting = {}
bot.packages = {}
bot.config = config
bot.debug = debug
bot.Discord = Discord
bot.client = client
bot.context = {}
bot.store = store

client.on("ready", () => {debug.log("서버 시작", debug.level.imp)})
client.login(config.token)

main(bot)