const discord = require('discord.js')

const color = [0xa75618,0x4e608d,0xffae00,0x00ffa1,0x00afff,0xff0042]
const parser = function (bot,user,nowBarrel,nowchannel,nowalias) {
    const solved = bot.apis.solved
    solved.user(user).then(userdata => {
        if (userdata.level > nowBarrel.level[user] && nowBarrel.level[user]) {
            const embed = new discord.RichEmbed()
            .setTitle(`**${user}**${(nowalias != undefined) ? "("+nowalias+")" : ""} 님의 승급을 축하해주세요!`)
            .setColor(color[Math.floor((userdata.level-1)/5)])
            .setDescription(`**${user}**${(nowalias != undefined) ?  "("+nowalias+")" : ""} 님이 **${userdata.tier}**으로 승급하셨습니다.`)
            .attachFile(`./plugins/solved/res/${userdata.level}.png`)
            .setThumbnail(`attachment://${userdata.level}.png`)
            bot.client.channels.get(nowchannel).send(embed)
        }
    nowBarrel.level[user] = userdata.level
    })
}

module.exports = function (bot) {
    const users = bot.store.load('solved/users')
    return function () {
        const nowBarrel = solvedBarrel.data
        const bjbarrel = bot.apis.baekjoon.barrel
        Object.keys(bjbarrel.data).map(function(key) {
            const users = bjbarrel.data[key].users
            const channel = bjbarrel.data[key].channel
            const proms = []
            for (user of users) {
                const usernick = bjbarrel.data[key].alias[user]
                proms.push(parser(bot,user,nowBarrel,channel,usernick))
            }
            Promise.all(proms).then(solvedBarrel.save())
        })
    }
}