const debuger = require('../../../lib/debug.js')
global.debug = debuger
const {RichEmbed} = require('discord.js')
const cheerio = require('cheerio')
const rp = require('request-promise-native')

const plugin = {
    name: 'kookbob',
    desc: '국민대 오늘의 학식 메뉴를 알려줍니다.',
    load (container) {
        debug.log('국밥: 플러그인 로드 완료', 2)
    },
    guildLoad (guild) {
    },
    message (msg) {
    },
    command (msg, keyword, param) {
        if (keyword == "kookbob" || keyword == "kb") {
            msg.channel.send('메뉴를 불러오는 중입니다...')
            rp("https://kmucoop.kookmin.ac.kr:42666/restaurant/restaurant.php?w=1").then(data=>{
                const embed = new RichEmbed()
                .setTitle("Kookbob")
                .setDescription("오늘의 메뉴입니다.")
                embed.addField
            })
            return true
        }
        return false
    },
    help (msg) {
        const pre = data.container[msg.guild.id].data.prefix
        const embed = new RichEmbed()
        .setTitle("Kookbob 플러그인 도움말")
        .setDescription("아이디를 등록하면 문제를 풀 때 마다 알려줍니다.")
        embed.addField(pre+'bjhere', '이 채널을 백준 플러그인의 알림 채널로 설정합니다.')
        embed.addField(pre+'bjjoin <id>', '백준 아이디를 플러그인에 등록합니다.')
        embed.addField(pre+'bj <number>', '백준 문제를 공유합니다.')
        embed.addField(pre+'bjalias <id> <alias>', '해당 아이디의 별명을 설정합니다.')
        msg.channel.send({embed})
    }
}
module.exports = plugin