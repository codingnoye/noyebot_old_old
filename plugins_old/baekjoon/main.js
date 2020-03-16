const debug = require('../../lib/debug.js')
const Barrel = require('../../lib/barrel.js')
const {RichEmbed} = require('discord.js')

const plugin = (bot) => {
    const bjBarrel = new Barrel('baekjoon')
    const command = require('./command.js')(bot, bjBarrel)
    const checker = require('./check.js')(bot, bjBarrel)
    return {
        name: 'baekjoon',
        desc: '백준 문제를 풀면 알려주는 플러그인입니다.',
        load () {
            debug.log('baekjoon 플러그인 로드 완료', 2)
            setInterval(checker, 10000)
        },
        guildLoad (guild) {
            bjBarrel.data[guild.id] = bjBarrel.data[guild.id] || {channel: '', lastcheck: -1, school: -1, users: [], alias: {}}
            bjBarrel.save()
        },
        message (msg) {
        },
        command: command,
        help (msg) {
            const pre = bot.guilds[msg.guild.id].data.prefix
            const embed = new RichEmbed()
            .setTitle("Baekjoon 플러그인 도움말")
            .setColor(0x428BCA)
            .setDescription("아이디를 등록하면 문제를 풀 때 마다 알려줍니다.")
            embed.addField(pre+'bjhere <schoolid>', '이 채널을 백준 플러그인의 알림 채널로 설정합니다. 백준의 학교 id가 필요합니다')
            embed.addField(pre+'bjjoin <id>', '백준 아이디를 플러그인에 등록합니다.')
            embed.addField(pre+'bjusers', '등록된 사용자들의 목록을 봅니다.')
            embed.addField(pre+'bj <number>', '백준 문제를 공유합니다.')
            embed.addField(pre+'bjalias <id> <alias>', '해당 아이디의 별명을 설정합니다.')
            msg.channel.send({embed})
        },
        api: {
            barrel : bjBarrel
        }
    }
}
module.exports = plugin