const checker = require('../checker.js')
module.exports = {
    func : (bot, msg, param)=>{
        const gid = msg.guild.id
        const cid = msg.channel.id
        const guild = bot.store.load(`baekjoon/${gid}`)
        if (param.length) {
            msg.channel.send('Baekjoon : 이 채널에 메시지를 전송합니다.')
            guild.target = parseInt(param)
            guild.channel = cid
            guild.users = {}
            guild.lastckeck = -1
            bot.store.save(`baekjoon/${gid}`)
            setInterval(()=>{checker(bot, gid)}, 10000)
        } else {
            msg.channel.send('대상 단체 id를 입력해 주세요.')
        }
    },
    keyword : 'bjinit',
    help : '현재 채널을 백준 알림을 받을 채널로 설정하고, 크롤링할 단체 ID를 입력받습니다.',
    args : 'targetID'
}