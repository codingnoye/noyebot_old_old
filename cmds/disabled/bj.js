const {RichEmbed} = require('discord.js')
module.exports = {
    func : (msg, barrel, param) => {
        if (param.length != 0) {
            const embed = new RichEmbed()
            .setTitle(`Baekjoon ${param}번 문제`)
            .setThumbnail("https://images-ext-2.discordapp.net/external/ICM3xDG4TGCb6rnVcsUAZdRarBUh-F_s_mOZiEY8oqA/http/onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og-1200.png?width=892&height=468")
            .setDescription(`https://www.acmicpc.net/problem/${param}`)
            msg.channel.send(embed)
        } else {
            msg.channel.send("인자를 입력해 주세요.")
        }
    },
    keyword : 'bj',
    help : '백준 링크를 겁니다.',
    args : '문제번호'
}