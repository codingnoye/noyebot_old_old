// command 모듈들
const commands = [
    require('./cmd/help'),
    require('./cmd/echo.js'),
    require('./cmd/prefix.js'),
    require('./cmd/say.js'),
    require('./cmd/set.js'),
    require('./cmd/setting.js')
]

// 실제 명령어들이 들어가는 객체
const cmds = {}
for (cmd of commands) {
    cmds[cmd.keyword] = cmd.func
}

// 패키지 구현
const package = (bot) => {
    return {
        name: `${bot.config.botname} 기본`,
        desc: `${bot.config.botname}의 기본 기능입니다.`,

        // 패키지가 로드될 때 호출
        onLoad () {},

        // 새로운 서버가 인식될 때 호출
        onGuildLoad (msg, gid) {
            // 기본 prefix를 !로 지정
            if (!bot.setting[gid].hasOwnProperty('prefix')) {
                bot.setting[gid].prefix = '!'
                bot.store.save(`guilds/${gid}`)
            }
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
        api: {},

        // 도움말
        help (msg) {
            const pre = bot.setting[msg.guild.id].prefix

            const embed = new bot.Discord.RichEmbed()
            .setTitle(`${bot.config.botname} 기본 도움말`)
            .setColor(0x428BCA)
            .setDescription(`${bot.config.botname}의 기본 기능 도움말입니다.`)

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