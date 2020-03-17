const checker = require('./checker.js')
const solvedChecker = require('./solved/checker.js')

// command 모듈들
const commands = [
    require('./cmd/bjinit.js'),
    require('./cmd/bjadd.js')
]

// 실제 명령어들이 들어가는 객체
const cmds = {}
for (cmd of commands) {
    cmds[cmd.keyword] = cmd.func
}

// 패키지 구현
const package = (bot) => {
    return {
        name: `백준`,
        desc: `백준 문제를 풀면 알려줍니다.`,

        // 패키지가 로드될 때 호출
        onLoad () {
            solvedChecker(bot)
        },

        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {
            this.guild[gid] = bot.store.load(`baekjoon/${gid}`)
            if (this.guild[gid].hasOwnProperty('target'))
                setInterval(()=>{checker(bot, gid)}, 10000)
        },

        // 서버에 메시지가 왔을 때 호출
        onMsg (msg) {},

        // 명령어가 호출되었을 때 호출
        onCmd (msg, keyword, param) {
            if (cmds.hasOwnProperty(keyword)) {
                cmds[keyword](bot, msg, param)
                return true
            }
            return false
        },

        // 다른 패키지에서 접근할 수 있는 객체, 자유로운 이름으로 작성 가능
        guild: {},

        // 도움말
        help (msg) {
            const pre = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`백준 패키지 도움말`)
            .setColor(0x428BCA)
            .setDescription(`백준 패키지의 도움말입니다.`)

            for (cmd of commands)
                if (cmd.args)
                    embed.addField(`${pre}${cmd.keyword} ${cmd.args.split(' ').map(x=>'<'+x+'>').join(' ')}`, cmd.help)
                else 
                    embed.addField(`${pre}${cmd.keyword}`, cmd.help)
            
            msg.channel.send({embed})
        }
    }
}
module.exports = package