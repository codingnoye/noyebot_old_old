// 저장해야 할 데이터 관리
const fs = require('fs')
const data = {}

module.exports = {
  load (filename) {
    
    // 이미 로드된 경우
    if (data.hasOwnProperty(filename))
      return data[filename]

    // 로드되지 않은 경우 -> 로드
    try {
      fs.statSync(`data/${filename}.json`)
      data[filename] = JSON.parse(fs.readFileSync(`data/${filename}.json`, 'utf8'))
      return data[filename]
    }

    // 없는 파일에 접근하는 경우 -> 새로 만듦
    catch (e) {
      const dir = `data/${filename.substring(0, filename.lastIndexOf('/'))}`
      fs.mkdirSync(dir, { recursive: true })
      if (e.code == 'ENOENT') {
        data[filename] = {}
        fs.writeFileSync(`data/${filename}.json`, JSON.stringify(data[filename], null, '  '))
      }
      else {
        throw e
      }
      return data[filename]
    }

  },
  async save (filename) {
    fs.writeFileSync(`data/${filename}.json`, JSON.stringify(data[filename], null, '  '))
    return true
  }
}