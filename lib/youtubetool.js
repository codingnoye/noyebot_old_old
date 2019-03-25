const Youtube = require('youtube-node')
const youtube = new Youtube()

// youtube.setKey(setting.youtubeToken)
youtube.setKey("AIzaSyANQ0KvB3OQktV2gylVjU7VbUt-ECIzS58")

youtube.addParam('order', 'relevance')
youtube.addParam('type', 'video')

module.exports = {
  search: (word, count) => {
    return new Promise((res, rej) => {
      youtube.search(word, count, function(e, data) {
        if (e) {
          rej(e)
        }
        const formatData = []
        for (item of data["items"]) {
          const nowItem = {
            title: item["snippet"]["title"],
            description: (item["snippet"]["description"])?item["snippet"]["description"]:"설명이 없습니다.",
            url: `https://www.youtube.com/watch?v=${item["id"]["videoId"]}`,
            thumbnail: item["snippet"]["thumbnails"]["default"]
          }
          formatData.push(nowItem)
        }
        res(formatData)
      })
    })
  }
}
