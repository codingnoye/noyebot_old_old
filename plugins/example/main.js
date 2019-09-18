const plugin = {
    name: 'example',
    desc: '아무 기능이 없는 테스트 플러그인입니다.',
    load (container) {
        debug.log('example: 플러그인 로드 완료', 2)
    },
    guildLoad (guild) {
        debug.log('example: 서버 로드')
    },
    message (msg) {
        debug.log('example: 메시지 받음')
    },
    command (msg, keyword, param) {
        if (keyword == "echo2") {
            msg.channel.send(param)
            return true
        }
        return false
    },
    help (msg) {
        msg.channel.send('example 플러그인의 도움말입니다.')
    },
    api: {
        
    }
}
module.exports = plugin