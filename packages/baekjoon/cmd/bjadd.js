module.exports = {
    func : (bot, msg, param)=>{
        const params = param.split(" ")
        const gid = msg.guild.id
        const guild = bot.store.load(`baekjoon/${gid}`)

        if (!guild.hasOwnProperty('target')) {
            // init이 안된 경우
            msg.channel.send(`${bot.config.prefix}bjinit을 통해 학교 등록 후 사용해주세요. 자세한 것은 도움말을 참고해주세요.`)
        } else if (params.length == 2) {
            if (guild.users.hasOwnProperty(params[0])) {
                // 이미 add된 사용자 별명 변경
                guild.users[params[0]] = params[1]
                msg.channel.send(`${params[0]}님의 별명이 ${params[1]}로 변경되었습니다.`)
            } else {
                // 신규 사용자
                guild.users[params[0]] = params[1]
                msg.channel.send(`${params[0]}(${params[1]})님이 등록되었습니다.`)
            }
            bot.store.save(`baekjoon/${gid}`)
        } else if (params.length == 1) {
            if (guild.users.hasOwnProperty(params[0])) {
                // 이미 add된 사용자
                msg.channel.send(`이미 등록된 사용자입니다.`)
            } else {
                // 신규 사용자
                guild.users[params[0]] = null
                msg.channel.send(`${params[0]}님이 등록되었습니다.`)
            }
            bot.store.save(`baekjoon/${gid}`)
        } else {
            msg.channel.send("인자의 개수가 올바르지 않습니다.")
        }
    },
    keyword : 'bjadd',
    help : '백준 체크 리스트에 등록합니다. 별명도 설정할 수 있습니다.',
    args : 'id ?alias'
}