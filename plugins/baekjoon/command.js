const {RichEmbed} = require('discord.js')
const debug = require('../../lib/debug.js')
const rp = require('request-promise-native')
const cheerio = require('cheerio')

module.exports = function (bot, barrel) {
    return async function (msg, keyword, param) {
        const solved = bot.apis.solved
        if (keyword == "bjhere") {
            const guild = barrel.data[msg.guild.id]
            const cid = msg.channel.id
            if (param.length) {
                msg.channel.send('Baekjoon : 이 채널에 메시지를 전송합니다.')
                guild.school = parseInt(param)
                guild.channel = cid
                debug.log(cid)
                debug.log(guild.channel)
            } else {
                msg.channel.send('학교 id를 입력해 주세요.')
            }
            return true
        } else if (keyword == "bjjoin") {
            const guild = barrel.data[msg.guild.id]
            if (param.length) {
                guild.users.push(param)
                msg.channel.send(`${param}가 등록되었습니다.`)
            } else {
                msg.channel.send('백준 아이디를 입력하세요.')
            }
            return true
        } else if (keyword == "bjusers") {
            const guild = barrel.data[msg.guild.id]
            const embed = new RichEmbed()
            .setColor(0x428BCA)
            .setTitle("Baekjoon : 등록된 사용자")
            .setDescription("알림을 받는 사용자들의 목록입니다.")
            const rawUsers = []
            for (user of guild.users) {
                const alias = guild.alias[user]
                const userdata = await solved.user(user)
                rawUsers.push([user, userdata])
            }
            const users = rawUsers.sort((a, b) => {
                return b[1].rawXp - a[1].rawXp
            })
            for (user of users) {
                const username = user[0]
                const alias = guild.alias[username]
                const userdata = user[1]
                embed
                .addField(`**${username}**${typeof alias=="undefined"?"":'('+alias+')'} : ${userdata.solved} 문제`, `**${ userdata.tier }** (${ userdata.xp } xp)`)
            }
            msg.channel.send({embed})
            return true
        } else if (keyword == "bj") {
            if (param.length) {
                (async ()=>{
                    const probdata = await bot.apis.solved.problem(param)
                    const data = await rp(`https://www.acmicpc.net/problem/${param}`)
                    const $ = cheerio.load(data)
                    const embed = new RichEmbed()
                    .setTitle('**' + $('title').text() + '**')
                    .setDescription(`[나도 풀러 가기](https://www.acmicpc.net/problem/${param}) >`)
                    .addField('정답', $('td:nth-child(4)').text() + ' (' + $('td:nth-child(6)').text() + ')', true)
                    if (probdata.kudeki_level > 0) {
                        embed.attachFile(`./plugins/solved/res/k${probdata.kudeki_level}.png`)
                        .setThumbnail(`attachment://k${probdata.kudeki_level}.png`)
                        .setColor(bot.apis.solved.kcolor)
                    } else {
                        embed.attachFile(`./plugins/solved/res/${probdata.level}.png`)
                        .setThumbnail(`attachment://${probdata.level}.png`)
                        .setColor(bot.apis.solved.color[Math.floor((probdata.level-1)/5)])
                    }
                    msg.channel.send(embed)
                })()
            } else {
                msg.channel.send('인자를 입력하세요.')
            }
            return true
        } else if (keyword == "bjalias") {
            const guild = barrel.data[msg.guild.id]
            const params = param.split(" ")
            if (params.length == 2) {
                guild.alias[params[0]] = params[1]
                msg.channel.send(`${params[0]}의 별명이 ${params[1]}이(가) 되었습니다.`)
            } else {
                msg.channel.send('인자의 개수가 올바르지 않습니다.')
            }
            return true
        }
        return false
    }
}
