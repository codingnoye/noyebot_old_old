const {RichEmbed} = require('discord.js')
const fs = require('fs')

const AsyncFunction = (async () => {}).constructor // 비동기 함수 인식용 (instanceOf를 사용하기 위함)

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

// 메인
const command = (bot) => {
  return async (msg) => {
    const guild = bot.guilds[msg.guild.id].data
    guild.prefix = guild.prefix || '!'
    if (msg.content.startsWith(guild.prefix)) {
      const params = msg.content.replace(guild.prefix, '').split(" ")
      const keyword = params[0]
      const param = params.slice(1).join(" ")
      
      // 명령어 처리
      for (cmd of cmds) {
          if (cmd.keyword == keyword) {
            if (cmd.func instanceof AsyncFunction) {
              await cmd.func(bot, msg, guild, param)
            } else {
              cmd.func(bot, msg, guild, param)
            }
            return true
          }
      }
      for (plugin of bot.plugins) {
        if (plugin.command instanceof AsyncFunction) {
          if (await plugin.command(msg, keyword, param)) {
            return true
          }
        } else {
          if (plugin.command(msg, keyword, param)) {
            return true
          }
        }
      }
      msg.channel.send(`'${keyword} ${param}'을(를) 이해할 수 없습니다.`)
      return false
    }
  }
}

module.exports = command

// help 명령어 추가
addCmd(async (bot, msg, guild, param) => {
  if (param.length) {
    let ischecked = false
    for (plugin of bot.plugins){
      if (plugin.name == param) {
        plugin.help(msg)
        ischecked = true
      }
    }
    if (ischecked == false){
      msg.channel.send('해당 플러그인이 없습니다.')
    }
  } else {
    const pre = guild.prefix
    const embed = new RichEmbed()
    .setTitle(bot.setting.botname+" 도움말")
    .setDescription(bot.setting.botname+"의 명령어와 설명입니다.")
    .setColor(0x428BCA)
    for (cmd of cmds){
      if (cmd.args){
        embed.addField(`${pre}${cmd.keyword} ${cmd.args.split(' ').map(x=>'<'+x+'>').join(' ')}`, cmd.help)
      } else {
        embed.addField(`${pre}${cmd.keyword}`, cmd.help)
      }
    }
    msg.channel.send({embed})
  }
}, 'help', '도움말을 보여줍니다. 플러그인의 도움말도 볼 수 있습니다.', args = '?plugin')

// plugin 명령어 추가
addCmd( function (bot, msg, guild, param) {
  if (param.length == 0) {
    const embed = new RichEmbed()
    .setTitle('플러그인 목록')
    .setDescription(`'${bot.guilds[msg.guild.id].data.prefix}help <plugin>'을 입력하면 해당 플러그인의 도움말을 볼 수 있습니다.`)
    .setColor(0x428BCA)
    for (plugin of bot.plugins){
        embed.addField(plugin.name, plugin.desc)
    }
    msg.channel.send({embed})
  } else {
    let ischecked = false
    for (plugin of bot.plugins){
      if (plugin.name == param) {
        plugin.help(msg)
        ischecked = true
      }
    }
    if (ischecked == false){
      msg.channel.send('해당 플러그인이 없습니다.')
    }
  }
}, 'plugin', '확장들의 목록을 보여줍니다. 이름을 입력하면 해당 확장의 도움말을 보여줍니다.', '?plugin')

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