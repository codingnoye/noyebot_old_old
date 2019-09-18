module.exports = {
    func : (msg, guild, param) =>  {
        const params = param.split(" ")
        if (params.length == 1) {
          if (params[0].length == 1) {
            guild.prefix = params[0]
            msg.channel.send(`호출 키워드가 ${params[0]}로 변경되었습니다.`)
            barrel.save().then(() => {})
          } else {
            msg.channel.send("한 글자만 입력해 주세요")
          }
        } else {
          msg.channel.send("인자의 개수가 올바르지 않습니다.")
        }
      },
    keyword : 'prefix',
    help : '호출 키워드를 변경합니다.',
    args : 'keyword'
}