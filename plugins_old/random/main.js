const {RichEmbed} = require('discord.js')

const rand = (min, max) => {
    return Math.floor(Math.random() * (max-min+1)) + min
}

const votes = {}
const plugin = (bot) => {
    return {
        name: 'random',
        desc: '랜덤 플러그인입니다.',
        load () {
        },
        guildLoad (guild) {
        },
        message (msg) {
        },
        command (msg, keyword, param) {
            if (keyword == "랜덤") {
                const params = param.split(' ')
                if (params.length == 1) {
                    msg.channel.send(rand(0, Number(params[0])))
                    return true
                } else if (params.length == 2) {
                    msg.channel.send(rand(Number(params[0]), Number(params[1])))
                    return true
                }
                else {
                    msg.channel.send('인자의 개수가 올바르지 않습니다.')
                    return true
                } 
            }
            else if (keyword == "선택") {
                const users = msg.guild.members.keyArray()
                console.log(users)
                msg.channel.send(`<@${users[rand(0, users.length-1)]}>`)
                return true
                
            }
            return false
        },
        help (msg) {
            const pre = bot.guilds[msg.guild.id].data.prefix
            const embed = new RichEmbed()
            .setTitle("투표 플러그인 도움말")
            .setColor(0x428BCA)
            .setDescription("투표가 가능합니다.")
            embed.addField(`${pre}투표 | ${pre}vote`, `투표를 만듭니다.`)
            embed.addField(`${pre}투표 <n>| ${pre}vote <n>`, `n번 선택지에 투표합니다.`)
            embed.addField(`${pre}투표 추가 | ${pre}vote add`, `선택지를 추가합니다.`)
            embed.addField(`${pre}투표 종료 | ${pre}vote end`, `투표를 종료합니다.`)
            embed.addField('예시', `\`\`\`\n${pre}투표 오늘 밥 뭐먹지?\n복식\n법식\n\`\`\``)
            msg.channel.send({embed})
        },
        api: {
        }
    }
}
module.exports = plugin