module.exports = {
    func : (bot, msg, guild, param)=>{
        const params = param.split(" ")
        if (params.length == 2) {
            guild[params[0]] = params[1]
            msg.channel.send(`${params[0]} 설정의 값이 ${params[1]}로 변경되었습니다.`)
        } else {
            msg.channel.send("인자의 개수가 올바르지 않습니다.")
        }
    },
    keyword : 'set',
    help : '설정을 변경합니다',
    args : 'key value'
}