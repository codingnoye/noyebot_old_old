// 중앙 처리 및 데이터 관리
const Barrel = require('../lib/barrel.js')
const fs = require('fs')
const setting = require("../data/config.js")
const debug = require('../lib/debug.js')

// bot객체 생성
const bot = {}
bot.guilds = {}
bot.plugins = []
bot.apis = {}
bot.setting = setting

const command = require("./command.js")(bot)

// 플러그인 로드
const enabledPlugin = require('../plugins/enabled.js')
const allPlugin = fs.readdirSync('plugins/')
for (pluginUrl of allPlugin) {
    if (enabledPlugin.indexOf(pluginUrl) != -1) {
        const plugin = require('../plugins/' + pluginUrl + '/main.js')(bot)
        plugin.load()
        bot.plugins.push(plugin)
        bot.apis[plugin.name] = plugin.api
    }
}

// main 함수
const main = function (client) {
    bot.client = client

    // on msessage 이벤트
    client.on("message", async msg => {
        if (!msg.author.bot) {
            if (msg.guild != null){
                const gid = msg.guild.id
                debug.log(`msg : ${msg.content}`)

                // 서버 인식
                if ((typeof bot.guilds[gid]) == 'undefined') { // 로드되지 않은 서버라면 로드(barrel의 형태로)
                    debug.log(`로드되지 않은 서버 감지됨 : ${gid} : ${msg.guild.name}`)
                    bot.guilds[gid] = new Barrel(gid)
                    for (plugin of bot.plugins) {
                        plugin.guildLoad(msg.guild)
                    }
                }

                // 메시지를 플러그인 모듈로 보내기
                for (plugin of bot.plugins) {
                    plugin.message(msg)
                }

                // 메시지를 명령어 모듈로 보내기
                await command(msg)
            } 
            else {
                debug.log(`dm : ${msg.content}`)
                msg.channel.send('현재 DM은 지원하지 않습니다.')
            }
        }
    })
}
module.exports = main

process.on('SIGINT', function() { // 종료시 barrel 데이터들을 저장
    debug.log('')
    debug.log("종료 감지", debug.level.imp)
    const promArr = []
    Object.keys(bot.guilds).map(function(key, index) {
        promArr.push(bot.guilds[key].save())
    })
    Promise.all(promArr).then(() => {
      debug.log("종료 전 모든 저장 완료", debug.level.imp)
      process.exit()
    })
  })