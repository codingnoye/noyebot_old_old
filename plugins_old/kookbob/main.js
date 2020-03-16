const debug = require('../../lib/debug.js')
const {RichEmbed} = require('discord.js')

const plugin = (bot) => {
    return {
        name: 'kookbob',
        desc: '국민대학교 학식을 알려주는 플러그인입니다.',
        load () {
            debug.log('kookbob 플러그인 로드 완료', 2)
        },
        guildLoad (guild) {
        },
        message (msg) {
        },
        command: command,
        help (msg) {
            const pre = bot.guilds[msg.guild.id].data.prefix
            const embed = new RichEmbed()
            .setTitle("kookbob 플러그인 도움말")
            .setColor(0x428BCA)
            .setDescription(".")
            embed.addField(pre+`sickdang`, `식당의 목록과 ID를 알려줍니다.`)
            embed.addField(pre+`bob <sickdang | sickdang ID>`, `특정 식당의 메뉴를 알려줍니다.`)
            msg.channel.send({embed})
        },
        api: {
        }
    }
}
module.exports = plugin