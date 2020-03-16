const {RichEmbed} = require('discord.js')
const Vote = require('./vote.js')

function isdigit(str){
    return /^\d+$/.test(str);
}

const votes = {}
const plugin = (bot) => {
    return {
        name: 'vote',
        desc: '투표 플러그인입니다.',
        load () {
        },
        guildLoad (guild) {
        },
        message (msg) {
            const cid = msg.channel.id
            if (typeof votes[cid] != 'undefined' && isdigit(msg.content)) {
                votes[cid].vote(msg.author.id, Number(msg.content))
                return
            }
        },
        command (msg, keyword, param) {
            if (keyword == "복수투표") {
                const cid = msg.channel.id
                const sparam = param.split('\n')
                if (param.length == 0) {
                    msg.channel.send('인자가 부족합니다.')
                    return true
                }
                if (sparam.length > 1) {
                    votes[cid] = new Vote(bot, cid, sparam.shift(), msg, sparam, ismulti = true)
                    return true
                } 
            }
            else if (keyword == "vote" || keyword == "투표") {
                const cid = msg.channel.id
                if (param.length == 0) {
                    msg.channel.send('인자가 부족합니다.')
                    return true
                }
                const params = param.split(' ')
                const sparam = param.split('\n')
                if (sparam.length > 1) {
                    votes[cid] = new Vote(bot, cid, sparam.shift(), msg, sparam)
                } else if (params[0] == "추가" || params[0] == "add") {
                    params.shift()
                    votes[cid].addChoice(params.join(' '))
                } else if (params[0] == "종료" || params[0] == "end") {
                    votes[cid].end()
                    votes[cid] = undefined
                } else if (typeof votes[cid] != 'undefined' && isdigit(params[0])) {
                    votes[cid].vote(msg.author.id, Number(params[0]))
                }
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