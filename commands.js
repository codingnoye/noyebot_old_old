// 명령어 처리 영역

// 모듈 로드
const rp = require('request-promise-native')
const {
  MessageAttachment,
  RichEmbed
} = require("discord.js")
// 유튜브 모듈 로드
const yt = require('./lib/youtubetool.js')
const ytdl = require('ytdl-core')

// 유틸리티
const AsyncFunction = (async () => {}).constructor
function need(needs, params) { // 인자가 부족한지 판단, 남는다면 뒤쪽의 인자들을 합침 (마지막 인자는 공백으로 구분하지 않고 최대 인자까지 받음)
  if (params.length < needs) {
    return false
  } else if (params.length > needs) {
    const joined = params.slice(needs - 1).join(" ")
    debug.log(joined)
    params.splice(needs - 1, 100, joined)
  }
  return true
}

// 명령어 처리
const cmds = []
const addCmd = (func, keyword, desc, args = null) => {
  cmds.push({
    func: func,
    keyword: keyword,
    args: args,
    desc: desc
  })
}

// 익스포트
module.exports = async (client, datas, msg) => {
  const gid = msg.guild.id
  const dataSet = datas.dataSet
  const now = dataSet[gid]
  now.data.setting.prefix = ((typeof now.data.setting.prefix) == 'undefined') ? '!' : now.data.setting.prefix
  if (msg.content.startsWith(now.data.setting.prefix)) {
    const nowMsg = msg.content.replace(now.data.setting.prefix, '')
    const param = nowMsg.split(" ")
    for (i = 0; i < param.length; i++) {
      param[i] = param[i].replace(/\_/gi, " ")
    }

    // 명령어 처리
    for (cmd of cmds) {
        if (cmd.keyword == param[0]) {
          if (cmd.func instanceof AsyncFunction) {
            await cmd.func(client, datas, msg, now, param.slice(1))
          } else {
            cmd.func(client, datas, msg, now, param.slice(1))
          }
          return true
        }
    }
    msg.channel.send(`'${nowMsg}'을(를) 이해할 수 없습니다.`)
    return false
  }
}
// 메시지 이벤트 처리

// help
addCmd(async (client, datas, msg, now, param)=>{
  const pre = now.data.setting.prefix
  const embed = new RichEmbed()
  .setTitle("노예봇 도움말")
  .setDescription("노예봇의 명령어와 설명입니다.")
  for (cmd of cmds){
    if (cmd.args){
      embed.addField(`${pre}${cmd.keyword} ${cmd.args}`, cmd.desc)
    } else {
      embed.addField(`${pre}${cmd.keyword}`, cmd.desc)
    }
  }
  msg.channel.send({embed})
}, 'help', '도움말을 보여줍니다.')

// echo
addCmd((client, datas, msg, now, param)=>{
  if (need(1, param)) {
    msg.channel.send(`${param[0]}`)
  } else {
    msg.channel.send('인자가 너무 적습니다.')
  }
}, 'echo', '메시지를 따라합니다.', '메시지')

// puppet
addCmd((client, datas, msg, now, param)=>{
  if (need(1, param)) {
    msg.channel.send(`${param[0]}`)
    msg.delete()
  } else {
    msg.channel.send('인자가 너무 적습니다.')
  }
}, 'puppet', '메시지를 대신 말합니다.', '메시지')

// info
addCmd((client, datas, msg, now, param)=>{
  msg.channel.send(`서버 ID : ${gid}\n채널 id : ${cid}\n서버 이름 : ${now.data.serverName}`)
}, 'info', '서버의 (기술적인) 정보를 봅니다.')

// setting
addCmd((client, datas, msg, now, param)=>{
  msg.channel.send(`${now.data.serverName}의 설정입니다.`)
  msg.channel.send(JSON.stringify(now.data.setting, null, '  '))
}, 'setting', '서버의 설정을 확인합니다.')

// set
addCmd((client, datas, msg, now, param)=>{
  if (need(2, param)) {
    now.data.setting[param[0]] = param[1]
    msg.channel.send(`${param[0]} 설정의 값이 ${param[1]}로 변경되었습니다.`)
    now.save().then(() => {})
  } else {
    msg.channel.send("인자가 너무 적습니다.")
  }
}, 'set', '설정을 변경합니다.', '키 값')

// prefix
addCmd((client, datas, msg, now, param)=>{
  if (need(1, param)) {
    now.data.setting.prefix = param[0]
    msg.channel.send(`호출 키워드가 ${param[0]}로 변경되었습니다.`)
    now.save().then(() => {})
  } else {
    msg.channel.send("인자가 너무 적습니다.")
  }
}, 'prefix', '호출 키워드를 변경합니다.', '키워드')

// yesorno
addCmd(async (client, datas, msg, now, param)=>{
  const options = {
    method: 'GET',
    uri: 'https://yesno.wtf/api',
    json: true
  }
  try {
    const ans = await rp(options)
    debug.log(ans.image)
    msg.channel.send(ans.answer.toUpperCase(), {
      file: ans.image
    })
  } catch (e) {
    msg.channel.send('API 요청 중 에러가 발생했습니다.')
    throw e
  }
}, 'yesorno', '선택장애를 해결해 줍니다.')

// comeon
const comeon = async (client, datas, msg, now, param)=>{
  debug.log(msg.member.voiceChannel)
  if (msg.member.voiceChannel) {
    const connection = await msg.member.voiceChannel.join();
    msg.channel.send(`${msg.member.voiceChannel.name} 채널에 연결했습니다.`)
    now.data.context.music.connection = connection
  } else {
    msg.channel.send('보이스채널에 연결한 후 사용해 주세요.')
  }
}
addCmd(comeon, 'comeon', '보이스채널에 노예봇을 부릅니다.')

// search
addCmd(async (client, datas, msg, now, param)=>{
  if (need(1, param)){
    if (!now.data.context.music.connection) {
      await comeon(client, datas, msg, now, param)
    }
    const data = await yt.search(param[0], 5)

    const embed = new RichEmbed()
    .setTitle(`'${param[0]}' 검색 결과`)
    .setDescription("상위 5개 결과입니다.")

    let index = 1
    for (item of data) {
      embed.addField(`${index}. ${item.title}`, item.description)
      index ++
    }

    msg.channel.send({embed})
    msg.channel.send(`번호를 선택한 후 ${now.data.setting.prefix}play N 으로 음악을 재생할 수 있습니다.`)
    now.data.context.music.ready = 1
    now.data.context.music.data = data
    console.log(now.data.context.data)
    now.save().then(() => {})
  } else {
    msg.channel.send('인자가 너무 적습니다.')
  }
}, 'search', '음악을 검색합니다.', '검색어')

// play
addCmd(async (client, datas, msg, now, param)=>{
  if (need(1, param)){
    if (now.data.context.music.connection && now.data.context.music.ready) {
      const streamOptions = { seek: 0, volume: 1 }
      const broadcast = client.createVoiceBroadcast()

      const stream = ytdl(now.data.context.music.data[Number(param[0]) - 1].url, { filter : 'audioonly' })
      const connection = now.data.context.music.connection
      broadcast.playStream(stream, { seek: 0, volume: (now.data.setting.volume)?(now.data.setting.volume):1 })
      const dispatcher = connection.playBroadcast(broadcast)
      now.data.context.music.ready = 2
      now.data.context.music.dispatcher = dispatcher
    } else {
      msg.channel.send(`음악 검색 후 사용해 주세요. ${now.data.setting.prefix}search 명령어로 검색할 수 있습니다.`)
    }
  }
}, 'play', '검색한 음악을 재생합니다.', '번호')

// volume
addCmd((client, datas, msg, now, param)=>{
  if (need(1, param)) {
    param[0] = Math.max(Math.min(param[0], 10), 0)
    now.data.setting.volume = param[0]*0.1
    msg.channel.send(`볼륨 ${param[0]}`)
    now.save().then(() => {})
  } else {
    msg.channel.send("인자가 너무 적습니다.")
  }
}, 'volume', '볼륨을 변경합니다. [0-10]', '크기')

// stop
addCmd((client, datas, msg, now, param)=>{
  if (now.data.context.music.ready == 2 && now.data.context.music.dispatcher) {
    now.data.context.music.dispatcher.end()
    msg.channel.send("음악을 정지합니다.")
    msg.member.voiceChannel.leave()
  } else {
    msg.channel.send("음악이 재생 중이 아닙니다.")
  }
}, 'stop', '음악을 정지합니다.')

// exit
addCmd((client, datas, msg, now, param)=>{
    datas.clearContext(now)
    msg.member.voiceChannel.leave()
}, 'exit', '보이스채널을 나갑니다.')
