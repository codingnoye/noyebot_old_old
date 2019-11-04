const {RichEmbed} = require('discord.js')
const debug = require('../../lib/debug.js')
const rp = require('request-promise-native')
const cheerio = require('cheerio')

const zfill = (l, val) => {
    val = '' + val
    while (val.length<l) {
        val = '0' + val
    }
    return val
}
const dateString = () => {
    const now = new Date()
    now.getUTCFullYear + zfill(2, 1 + now.getUTCMonth) + zfill(2, now.getUTCDate)
}

const sickdangs = {
}

module.exports = function (bot, barrel) {
    return async function (msg, keyword, param) {
        if (keyword == "bob") {
            rp(`https://kmucoop.kookmin.ac.kr/menu/menujson.php?sdate=${dateString()}&edate=${dateString()}&today=${dateString()}`)
            return true
        }
        return false
    }
}
