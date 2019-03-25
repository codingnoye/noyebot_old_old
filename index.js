const Discord = require("discord.js")
const client = new Discord.Client()
const colors = require('colors')
const core = require('./core.js')
const debuger = require('./lib/debug.js')
global.debug = debuger

const datas = {}
datas.dataSet = {}
datas.dataInit = function (data, serverName, serverId) {
  data.data.serverName = serverName
  data.data.serverId = serverId
  data.data.setting = {}
  data.data.setting.prefix = '!'
}
datas.clearContext = (data) => {
  data.data.context = {
    music: {}
  }
}
datas.init = (data) => {
  datas.clearContext(data)
}

client.on("ready", () => {
  debug.log("서버 시작", debug.level.imp)
})

global.setting = {
  botname: '노예봇',
  token: "NTMxMTE1NzIwMjczMjk3NDA5.DxJXJQ.FUXqvL9JBYaSHP0YeEIq7u6OVyA",
  youtubeToken: "AIzaSyANQ0KvB3OQktV2gylVjU7VbUt-ECIzS58"
}

core(client, datas)

client.login(setting.token)

process.on('SIGINT', function() { // 종료시 서버 데이터들을 저장
    debug.log("종료 감지", debug.level.imp)
    const promArr = []
    Object.keys(dataSet).map(function(key, index) {
        promArr.push(dataSet[key].save())
    })
    Promise.all(promArr).then(() => {
      debug.log("종료 전 모든 저장 완료", debug.level.imp)
      process.exit()
    })
})
