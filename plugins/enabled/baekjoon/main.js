const debuger = require('../../../lib/debug.js')
global.debug = debuger
const Barrel = require('../../../lib/barrel.js')
const {RichEmbed} = require('discord.js')
const cheerio = require('cheerio')
const rp = require('request-promise-native')
const solved = require('./solved.js')

const barrel = new Barrel('baekjoon')
const data = {}

const checker = require('./check.js')(barrel)
const plugin = {
    name: 'baekjoon',
    desc: '백준 문제를 풀면 알려주는 플러그인입니다.',
    load (container) {
        debug.log('백준: 플러그인 로드 완료', 2)
        data.container = container
        setInterval(checker, 10000)
    },
    guildLoad (guild) {
        barrel.data[guild.id] = barrel.data[guild.id] || {channel: '', lastcheck: -1, school: -1, users: [], alias: {}}
        barrel.save()
    },
    message (msg) {
    },
    async command (msg, keyword, param) {
        if (keyword == "bjhere") {
            const nowBarrel = barrel.data[msg.guild.id]
            const cid = msg.channel.id
            if (param.length) {
                msg.channel.send('Baekjoon : 이 채널에 메시지를 전송합니다.')
                nowBarrel.school = parseInt(param)
                nowBarrel.channel = cid
                debug.log(cid)
                debug.log(nowBarrel.channel)
            } else {
                msg.channel.send('학교 id를 입력해 주세요.')
            }
            return true
        } else if (keyword == "bjjoin") {
            const nowBarrel = barrel.data[msg.guild.id]
            if (param.length) {
                nowBarrel.users.push(param)
                msg.channel.send(`${param}가 등록되었습니다.`)
            } else {
                msg.channel.send('백준 아이디를 입력하세요.')
            }
            return true
        } else if (keyword == "bjusers") {
            const nowBarrel = barrel.data[msg.guild.id]
            const embed = new RichEmbed()
            .setColor(0x428BCA)
            .setTitle("Baekjoon : 등록된 사용자")
            .setDescription("알림을 받는 사용자들의 목록입니다.")
            const rawUsers = []
            for (user of nowBarrel.users) {
                const alias = nowBarrel.alias[user]
                const userdata = await solved.user(user)
                rawUsers.push([user, userdata])
            }
            const users = rawUsers.sort((a, b) => {
                return b[1].rawXp - a[1].rawXp
            })
            for (user of users) {
                const username = user[0]
                const alias = nowBarrel.alias[username]
                const userdata = user[1]
                embed
                .addField(`**${username}**${typeof alias=="undefined"?"":'('+alias+')'} : ${userdata.solved} 문제`, `**${ userdata.tier }** (${ userdata.xp } xp)`)
            }
            msg.channel.send({embed})
            return true
        } else if (keyword == "bj") {
            if (param.length) {
                (async ()=>{
                    const data = await rp(`https://www.acmicpc.net/problem/${param}`)
                    const $ = cheerio.load(data)
                    const embed = new RichEmbed()
                    .setTitle('**' + $('title').text() + '**')
                    .setImage("https://images-ext-2.discordapp.net/external/ICM3xDG4TGCb6rnVcsUAZdRarBUh-F_s_mOZiEY8oqA/http/onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og-1200.png?width=892&height=468")
                    .setDescription(`[나도 풀러 가기](https://www.acmicpc.net/problem/${param}) >`)
                    .setColor(0x428BCA)
                    .addField('제출', $('td:nth-child(3)').text(), true)
                    .addField('정답', $('td:nth-child(4)').text(), true)
                    .addField('정답 비율',$('td:nth-child(6)').text(), true)
                    .addField('Solved.ac', '**'+await solved.problem(param)+'**', true)
                    msg.channel.send(embed)
                })()
            } else {
                msg.channel.send('인자를 입력하세요.')
            }
            return true
        } else if (keyword == "bjalias") {
            const nowBarrel = barrel.data[msg.guild.id]
            const params = param.split(" ")
            if (params.length == 2) {
                nowBarrel.alias[params[0]] = params[1]
                msg.channel.send(`${params[0]}의 별명이 ${params[1]}이(가) 되었습니다.`)
            } else {
                msg.channel.send('인자의 개수가 올바르지 않습니다.')
            }
            return true
        }
        return false
    },
    help (msg) {
        const pre = data.container[msg.guild.id].data.prefix
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
    }
}
module.exports = plugin