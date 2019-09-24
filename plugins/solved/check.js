const {RichEmbed} = require('discord.js')
const discordapi = require('../../lib/discordapi.js')

const parser = function (bot,user,nowBarrel,nowchanner) {
    const solved = bot.apis.solved    
    solved.user(user).then(userdata => {
        if (userdata.level > nowBarrel.level[user] && nowBarrel.level[user]) {
            const color = {0:0xa75618,1:0x4e608d,2:0xffae00,3:0x00ffa1,4:0x00afff,5:0xff0042}
            const embed = new RichEmbed()
            .setTitle(user + "님의 승급을 축하해주세요!")
            .setColor(color[Math.floor((userdata.level-1)/5)])
            .setDescription(user + "님이 **" + userdata.tier + "**으로 승급하셨습니다.")
            discordapi.sendEmbed(nowchanner,embed)
        }
        nowBarrel.level[user] = userdata.level
    })
}

module.exports = function (bot, solvedBarrel) {
    return function () {
        const nowBarrel = solvedBarrel.data
        const bjbarrel = bot.apis.baekjoon.barrel
        Object.keys(bjbarrel.data).map(function(key) {
            const users = bjbarrel.data[key].users
            const proms = []
            for (user of users) {
                proms.push(parser(bot,user,nowBarrel,key))
            }
            Promise.all(proms).then(solvedBarrel.save())
        })
    }
}