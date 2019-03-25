// 저장 가능한 JSON: barrel 클래스
const fs = require('fs')

class Barrel {
  constructor (filename) {
    try {
      fs.statSync(`data/${filename}.json`)
      this.filename = filename
      this.data = JSON.parse(fs.readFileSync(`data/${filename}.json`, 'utf8'))
      debug.log(`파일 불러옴 : ${filename}`)
    }
    catch (e) {
      if (e.code == 'ENOENT') {
        debug.log(`파일을 찾을 수 없음`)
        this.filename = filename
        this.data = {}
        fs.writeFileSync(`data/${filename}.json`, JSON.stringify(this.data))
        debug.log(`파일 생성 : ${filename}`)
      }
      else {
        throw e
      }
    }
  }
  async save () {
    fs.writeFileSync(`data/${this.filename}.json`, JSON.stringify(this.data, '  '))
    debug.log(`파일 저장 : ${this.filename}`)
    return true
  }
}

module.exports = Barrel
