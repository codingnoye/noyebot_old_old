const rp = require('request-promise-native')
const cheerio = require('cheerio')
const {RichEmbed} = require('discord.js')

const parser = async function (bot, nowGuild) {
    const school = nowGuild.school
    if (school == -1) return

    const data = await rp(`https://www.acmicpc.net/status?result_id=4&school_id=${school}`)
    const $ = cheerio.load(data)
    const solutions = []
    const solved = bot.apis.solved

    $('tr').each((index, item) => {
        if (index == 0) return
        const solutionId = parseInt($(item).find('td:nth-child(1)').text())
        const user = $(item).find('td:nth-child(2)').text()
        const problem = parseInt($(item).find('td:nth-child(3)').text())
        const name = $(item).find('td:nth-child(3) .problem_title').attr('title')
        const solution = {id: solutionId, user: user, problem: problem, name: name}
        solutions.push(solution)
    })

    for (solution of solutions.filter(solution => solution.id > nowGuild.lastcheck)) {
        nowGuild.lastcheck = Math.max(nowGuild.lastcheck, solution.id)
        if (nowGuild.users.indexOf(solution.user) != -1) {
            const user = solution.user
            const problem = solution.problem
            const name = solution.name
            const alias = nowGuild.alias[user]
            const probdata = await solved.problem(problem) 

            const embed = new RichEmbed()
            .setTitle(`${user}${typeof alias=="undefined"?"":'('+alias+')'}님이 ${problem}번 문제를 풀었습니다!`)

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
            bot.client.channels.get(nowGuild.channel).send(embed)
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