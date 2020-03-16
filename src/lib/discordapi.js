const rp = require('request-promise-native')
const token = require("../data/config.js").token
module.exports = {
    get (url) {
        return rp({
            uri: 'https://discordapp.com/api/'+url,
            headers: {
                'Authorization': 'Bot '+token
            },
            json: true
        })
    },
    post (url, content) {
        return rp({
            method: 'POST',
            uri: 'https://discordapp.com/api/'+url,
            headers: {
                'Authorization': 'Bot '+token
            },
            body: {
                content: content
            },
            json: true
        })
    },
    send (channel, content) {
        return rp({
            method: 'POST',
            uri: 'https://discordapp.com/api/channels/'+channel+"/messages",
            headers: {
                'Authorization': 'Bot '+token
            },
            body: {
                content: content
            },
            json: true
        })
    },
    sendEmbed (channel, embed) {
        return rp({
            method: 'POST',
            uri: 'https://discordapp.com/api/channels/'+channel+"/messages",
            headers: {
                'Authorization': 'Bot '+token
            },
            body: {
                embed: embed
            },
            json: true
        })
    }
}