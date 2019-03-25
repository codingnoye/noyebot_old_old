module.exports = {
    func : (msg, barrel, param) => {
        if (param.length != 0) {
            msg.channel.send(`${param}`)
        } else {
            msg.channel.send("인자를 입력해 주세요.")
        }
    },
    keyword : 'echo',
    help : '도움말을 보여줍니다.'
}