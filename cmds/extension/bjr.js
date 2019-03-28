const {RichEmbed} = require('discord.js')
module.exports = {
    func : (msg, barrel, param) => {
        const rand = Math.floor(Math.random() * 17091) + 1
        const embed = new RichEmbed()
        .setTitle(`Baekjoon ${rand}번 문제`)
        .setThumbnail("https://images-ext-2.discordapp.net/external/ICM3xDG4TGCb6rnVcsUAZdRarBUh-F_s_mOZiEY8oqA/http/onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og-1200.png?width=892&height=468")
        .setDescription(`https://www.acmicpc.net/problem/${rand}`)
        msg.channel.send(embed)
    },
    keyword : 'bjr',
    help : '백준 랜덤 문제'
}