// 명령어 처리 영역
const {RichEmbed} = require('discord.js')
const fs = require('fs')
const setting = require("../config.js")

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
    for (plugin of plugins) {
      if (plugin.command(msg, keyword, param)) {
        return true
      }
    }
    msg.channel.send(`'${keyword} ${param}'을(를) 이해할 수 없습니다.`)
    return false
  }
}

module.exports = command

// help 명령어 추가
addCmd(async (msg, barrel, param) => {
  const pre = barrel.data.prefix
  const embed = new RichEmbed()
  .setTitle(setting.botname+" 도움말")
  .setDescription(setting.botname+"의 명령어와 설명입니다.")
  for (cmd of cmds){
    if (cmd.args){
      embed.addField(`${pre}${cmd.keyword} ${cmd.args.split(' ').map(x=>'<'+x+'>').join(' ')}`, cmd.help)
    } else {
      embed.addField(`${pre}${cmd.keyword}`, cmd.help)
    }
  }
  msg.channel.send({embed})
}, 'help', '도움말을 보여줍니다.')

// plugin 명령어 추가
addCmd( function (msg, barrel, param) {
  if (param.length == 0) {
    const embed = new RichEmbed()
    .setTitle('확장 목록')
    .setDescription("'plugin <확장이름>'을 입력하면 해당 확장의 도움말을 볼 수 있습니다.")
    for (plugin of plugins){
        embed.addField(plugin.name, plugin.desc)
    }
    msg.channel.send({embed})
  } else {
    let ischecked = false
    for (plugin of plugins){
      if (plugin.name == param) {
        plugin.help(msg)
        ischecked = true
      }
    }
    if (ischecked == false){
      msg.channel.send('해당 플러그인이 없습니다.')
    }
  }
}, 'plugin', '확장들의 목록을 보여줍니다. 이름을 입력하면 해당 확장의 도움말을 보여줍니다.')

// 명령어 로드 및 추가
const cmdList = fs.readdirSync('cmds/core/')
for (cmdurl of cmdList) {
  const cmd = require('../cmds/core/' + cmdurl)
  if (typeof cmd.args == "undefined") {
    cmd.args = null
  }
  addCmd(cmd.func, cmd.keyword, cmd.help, cmd.args)
}
const cmdList2 = fs.readdirSync('cmds/extension/')
for (cmdurl of cmdList2) {
  const cmd = require('../cmds/extension/' + cmdurl)
  if (typeof cmd.args == "undefined") {
    cmd.args = null
  }
  addCmd(cmd.func, cmd.keyword, cmd.help, cmd.args)
}