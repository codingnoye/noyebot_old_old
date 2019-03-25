const Discord = require("discord.js")
const client = new Discord.Client()
const debuger = require('./lib/debug.js')
const main = require('./src/main.js')
global.debug = debuger
global.setting = require("./config.js")

client.on("ready", () => {debug.log("서버 시작", debug.level.imp)})
client.login(setting.token)

main(client)