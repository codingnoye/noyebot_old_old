const rp = require('request-promise-native')
const cheerio = require('cheerio')
const discordapi = require('../../../lib/discordapi.js')
const {RichEmbed} = require('discord.js')

const parser = async function (user, barrel, key) {
    const data = await rp(`https://www.acmicpc.net/status?user_id=${user.name}&result_id=4`)
    const $ = cheerio.load(data)

    res = false
    if (parseInt($('.problem_title').html()) != user.old) {
        res = parseInt($('.problem_title').html())
    }
    if (res != false){
        if ((barrel.data[key].channel != '') && (user.old != 0)) {
            discordapi.send()
            const alias = barrel.data[key].alias[user.name]
            const embed = new RichEmbed()
            .setTitle(`${user.name}${typeof alias=="undefined"?"":'('+alias+')'}님이 ${res}번 문제를 풀었습니다!`)
            .setDescription(`${res}번 문제 : ${$('.problem_title').attr('title')}`)
            .setThumbnail("https://images-ext-2.discordapp.net/external/ICM3xDG4TGCb6rnVcsUAZdRarBUh-F_s_mOZiEY8oqA/http/onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og-1200.png?width=892&height=468")
            .addField('나도 풀러 가기', `https://www.acmicpc.net/problem/${res}`)
            discordapi.sendEmbed(barrel.data[key].channel, embed)
        }
        user.old = res
    }
}
module.exports = function (barrel) {
    return function () {
        Object.keys(barrel.data).map(function(key, index) {
            for (user of barrel.data[key].users) {
                parser(user, barrel, key).then(()=>{})
            }
        })
        barrel.save()
    }
}