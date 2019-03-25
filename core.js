// 중앙처리 및 데이터 관리 영역
const Data = require("./lib/data.js")
const commands = require("./commands.js")

// 메시지 이벤트 처리
module.exports = function(client, datas) {
  const dataSet = datas.dataSet

  client.on("message", async msg => {
    const gid = msg.guild.id
    const now = dataSet[gid]
    debug.log(`msg : ${msg.content}`)

    // 서버 인식
    if ((typeof dataSet[gid]) == 'undefined') {
      // 로드되지 않은 서버라면 로드
      debug.log(`로드되지 않은 서버 감지됨 : ${gid} : ${msg.guild.name}`)
      dataSet[gid] = new Data(gid)
      if (Object.keys(dataSet[gid].data).length == 0) {
        // 신규 서버 초기화
        debug.log(`서버 초기화 : ${gid} : ${msg.guild.name}`)
        datas.dataInit(dataSet[gid], msg.guild.name, gid)
        dataSet[gid].save().then(() => {})
      }
      datas.init(dataSet[gid])
    }

    // 명령어
    await commands(client, datas, msg)


  })
}
