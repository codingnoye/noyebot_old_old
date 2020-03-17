const rp = require('request-promise-native')
const cheerio = require('cheerio')
const solved = require('./solved/main.js')

const parser = async function (bot, gid) {
    const guild = bot.store.load(`baekjoon/${gid}`)
    const target = guild.target
    const RichEmbed = bot.Discord.RichEmbed

    // 받아오기
    const data = await rp(`https://www.acmicpc.net/status?result_id=4&school_id=${target}`)
    const $ = cheerio.load(data)
    const solutions = []

    // 파싱
    $('tr').each((index, item) => {
        if (index == 0) return
        const solutionId = parseInt($(item).find('td:nth-child(1)').text())
        const user = $(item).find('td:nth-child(2)').text()
        const problem = parseInt($(item).find('td:nth-child(3)').text())
        const name = $(item).find('td:nth-child(3) .problem_title').attr('title')
        const solution = {id: solutionId, user: user, problem: problem, name: name}
        solutions.push(solution)
    })

    // 알림
    for (solution of solutions.filter(solution => solution.id > guild.lastcheck)) {
        guild.lastcheck = Math.max(guild.lastcheck, solution.id)
        if (guild.users.hasOwnProperty(solution.user)) {
            const user = solution.user
            const problem = solution.problem
            const name = solution.name
            const alias = guild.users[user]
            const probdata = await solved.problem(problem) 

            const embed = new RichEmbed()
            .setTitle(`${user}${alias==null?"":'('+alias+')'}님이 ${problem}번 문제를 풀었습니다!`)

            .setDescription(`${problem}번 문제 : ${name}`)
            .addField('나도 풀러 가기', `https://www.acmicpc.net/problem/${problem}`)
            .addField('Solved.ac', '**' + probdata.tier + '**')
            if (probdata.kudeki_level > 0) {
                embed.attachFile(`./plugins/solved/res/k${probdata.kudeki_level}.png`)
                .setThumbnail(`attachment://k${probdata.kudeki_level}.png`)
                .setColor(bot.apis.solved.kcolor)
            } else {
                embed.attachFile(`./plugins/solved/res/${probdata.level}.png`)
                .setThumbnail(`attachment://${probdata.level}.png`)
                .setColor(bot.apis.solved.color[Math.floor((probdata.level-1)/5)])
            }
            bot.client.channels.get(guild.channel).send(embed)
        }
    }

}
module.exports = function (bot, bjBarrel) {
    return function () {
        Object.keys(bjBarrel.data).map(function(key, index) {
            const nowGuild = bjBarrel.data[key]
            parser(bot, nowGuild).then(()=>{
                bjBarrel.save()
            })
        })
    }
}