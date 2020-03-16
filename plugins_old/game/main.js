const {RichEmbed} = require('discord.js')
const Bera = require('./bera.js')

function isdigit(str){
    return /^\d+$/.test(str);
}

const games = {}
const plugin = (bot) => {
    return {
        name: 'game',
        desc: '몇 가지 간단한 게임을 할 수 있는 플러그인입니다.',
        load () {
        },
        guildLoad (guild) {
        },
        message (msg) {
            const uid = msg.author.id
            if (typeof games[uid] != 'undefined' && isdigit(msg.content)) {
                const answer = games[uid].next(Number(msg.content))
                if (answer == -1) {
                    msg.channel.send('내가 이겼다~')
                    games[uid] = undefined
                    return
                }
                if (answer == -2) {
                    msg.channel.send('니가 이겼다 ㅠ')
                    games[uid] = undefined
                    return
                }
                if (answer == -3) {
                    msg.channel.send('개솔 ㄴ')
                    return
                }
                msg.channel.send(answer)
                return
            }
        },
        command (msg, keyword, param) {
            if (keyword == "bera") {
                const cid = msg.channel.id
                const uid = msg.author.id
                games[uid] = new Bera()
                msg.channel.send('베스킨 라빈스 31~')
                msg.channel.send('2')
                return true
            }
            return false
        },
        help (msg) {
            const pre = bot.guilds[msg.guild.id].data.prefix
            const embed = new RichEmbed()
            .setTitle("게임 플러그인 도움말")
            .setColor(0x428BCA)
            .setDescription("간단한 게임이 가능합니다.")
            embed.addField(`${pre}bera`, `베스킨라빈스 게임을 시작합니다.`)
            msg.channel.send({embed})
        },
        api: {
        }
    }
}
module.exports = plugin