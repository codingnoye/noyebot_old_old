// 명령어 처리 영역
const cmdlist = require('../cmds/list.js')
const {RichEmbed} = require('discord.js')

// 유틸리티
const AsyncFunction = (async () => {}).constructor // 비동기 함수 인식용

// 명령어 리스트, 추가 메소드
const cmds = []
const addCmd = (func, keyword, help, args = null) => {
  cmds.push({
    func: func,
    keyword: keyword,
    args: args,
    help: help
  })
}

// 익스포트
const command = async (client, barrel, msg) => {
  barrel.data.prefix = barrel.data.prefix || '!'
  if (msg.content.startsWith(barrel.data.prefix)) {
    const params = msg.content.replace(barrel.data.prefix, '').split(" ")
    const keyword = params[0]
    const param = params.slice(1).join(" ")

    // 명령어 처리
    for (cmd of cmds) {
        if (cmd.keyword == keyword) {
          if (cmd.func instanceof AsyncFunction) {
            await cmd.func(msg, barrel, param)
          } else {
            cmd.func(msg, barrel, param)
          }
          return true
        }
    }
    msg.channel.send(`'${keyword} ${param}'을(를) 이해할 수 없습니다.`)
    return false
  }
}

module.exports = command

// help 명령어 추가
addCmd(async (msg, barrel, param)=>{
  const pre = barrel.data.prefix
  const embed = new RichEmbed()
  .setTitle("노예봇 도움말")
  .setDescription("노예봇의 명령어와 설명입니다.")
  for (cmd of cmds){
    if (cmd.args){
      embed.addField(`${pre}${cmd.keyword} ${cmd.args}`, cmd.help)
    } else {
      embed.addField(`${pre}${cmd.keyword}`, cmd.help)
    }
  }
  msg.channel.send({embed})
}, 'help', '도움말을 보여줍니다.')

// 명령어 로드 및 추가
for (cmdurl of cmdlist) {
  const cmd = require('../cmds/' + cmdurl)
  if (typeof cmd.args == "undefined") {
    cmd.args = null
  }
  addCmd(cmd.func, cmd.keyword, cmd.help, cmd.args)
}