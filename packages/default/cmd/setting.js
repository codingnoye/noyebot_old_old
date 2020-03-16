module.exports = {
    func : (bot, msg, param)=>{
        msg.channel.send(`${msg.guild.name}의 설정입니다.`)
        msg.channel.send(JSON.stringify(bot.setting[msg.guild.id], null, '  '))
    },
    keyword : 'setting',
    help : '현재 서버의 설정을 확인합니다.'
}