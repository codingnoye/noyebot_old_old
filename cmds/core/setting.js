module.exports = {
    func : (msg, barrel, param)=>{
        msg.channel.send(`${msg.guild.name}의 설정입니다.`)
        msg.channel.send(JSON.stringify(barrel.data || {}, null, '  '))
    },
    keyword : 'setting',
    help : '현재 서버의 설정을 확인합니다.'
}