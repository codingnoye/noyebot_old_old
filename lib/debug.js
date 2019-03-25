const colors = require('colors')

// 디버거
// level에 따라 포맷이 다름

module.exports = {
  log (text, level = 0) {
    switch (level) {
      case 0:
        console.log(text.grey)
        break
      case 1:
        console.log(text.white)
        break
      case 2:
        console.log(text.white.bold)
        break
      case 3:
        console.log("중요".white.bold.bgBlue + " " + text.white)
        break
      case 4:
        console.log("경고".white.bold.bgYellow + " " + text.white)
        break
      case 5:
        console.error("에러".white.bold.bgRed + " " + text.white)
        break
      case 6:
        console.log(text)
        break
    }
  },
  level: {
    weak: 0,
    normal: 1,
    strong: 2,
    imp: 3,
    warn: 4,
    err: 5,
    custom: 6
  }
}
