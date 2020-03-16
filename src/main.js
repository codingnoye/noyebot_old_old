// 중앙 처리 및 데이터 관리
const Barrel = require('./store.js')
const fs = require('fs')
const debug = require('./lib/debug.js')

// main 함수
const main = function (bot) {
    const client = bot.client

    // 패키지 로드
    const allUrl = fs.readdirSync('packages/')
    for (url of allUrl) {
        const package = require('../packages/' + url + '/main.js')(bot)
        package.onLoad()
        bot.packages[package.name] = package
    }

    // on msessage 이벤트
    client.on("message", async msg => {
        if (!msg.author.bot) {
            if (msg.guild != null){
                const gid = msg.guild.id
                debug.log(`msg : ${msg.content}`)

                // 서버 인식
                if ((typeof bot.setting[gid]) == 'undefined') { // 로드되지 않은 서버라면 로드(barrel의 형태로)
                    bot.setting[gid] = bot.store.load(`guilds/${gid}`)
                    for (packageName in bot.packages) {
                        bot.packages[packageName].onGuildLoad(msg, msg.guild.id)
                    }
                }
                const prefix = bot.setting[gid].prefix

                // 메시지를 플러그인 모듈로 보내기
                if (msg.content.startsWith(prefix)) {
                    // 명령어
                    const parts = msg.content.replace(prefix, '').split(" ")
                    const keyword = parts[0]
                    const param = parts.slice(1).join(" ")
                    let worked = false
                    for (packageName in bot.packages) {
                        if (bot.packages[packageName].onCmd(msg, keyword, param) == true)
                            worked = true
                    }
                    if (!worked)
                        msg.channel.send(`'${keyword} ${param}'을(를) 이해할 수 없습니다.`)
                } else {
                    // 일반 메시지
                    for (packageName in bot.packages) {
                        bot.packages[packageName].onMsg(msg)
                    }
                }
                
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