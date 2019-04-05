const debuger = require('../../../lib/debug.js')
global.debug = debuger
const Barrel = require('../../../lib/barrel.js')
const {RichEmbed} = require('discord.js')

const barrel = new Barrel('baekjoon')
const data = {}

const checker = require('./checker.js')(barrel)
const plugin = {
    name: 'baekjoon',
    desc: '백준 문제를 풀면 알려주는 플러그인입니다.',
    load (container) {
        debug.log('백준: 플러그인 로드 완료', 2)
        data.container = container
        setInterval(checker, 10000)
    },
    guildLoad (guild) {
        barrel.data[guild.id] = barrel.data[guild.id] || {channel: '', users: []}
        barrel.save()
    },
    message (msg) {
    },
    command (msg, keyword, param) {
        if (keyword == "bjhere") {
            msg.channel.send('백준: 이 채널에 메시지를 전송합니다.')
            barrel.data[msg.guild.id].channel = msg.channel.id
            return true
        } else if (keyword == "bjjoin") {
            if (param.length) {
                msg.channel.send(param + '가 등록되었습니다.')
                barrel.data[msg.guild.id].users.push({name: param, old: 0})
            } else {
                msg.channel.send('백준 아이디를 입력하세요.')
            }
            return true
        }
        return false
    },
    help (msg) {
        const pre = data.container[msg.guild.id].data.prefix
        const embed = new RichEmbed()
        .setTitle("백준 플러그인 도움말")
        .setDescription("아이디를 등록하면 문제를 풀 때 마다 알려줍니다.")
        embed.addField(pre+'bjhere', '이 채널을 백준 플러그인의 알림 채널로 설정합니다.')
        embed.addField(pre+'bjjoin <name>', '백준 아이디를 플러그인에 등록합니다.')
        msg.channel.send({embed})
    }
}
module.exports = plugin