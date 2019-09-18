const rp = require('request-promise-native')
const cheerio = require('cheerio')
const discordapi = require('../../lib/discordapi.js')
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

            const embed = new RichEmbed()
            .setTitle(`${user}${typeof alias=="undefined"?"":'('+alias+')'}님이 ${problem}번 문제를 풀었습니다!`)
            .setColor(0x428BCA)
            .setDescription(`${problem}번 문제 : ${name}`)
            .setThumbnail("https://images-ext-2.discordapp.net/external/ICM3xDG4TGCb6rnVcsUAZdRarBUh-F_s_mOZiEY8oqA/http/onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og-1200.png?width=892&height=468")
            .addField('나도 풀러 가기', `https://www.acmicpc.net/problem/${problem}`)
            .addField('Solved.ac', '**' + await solved.problem(problem) + '**')
            discordapi.sendEmbed(nowGuild.channel, embed)
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