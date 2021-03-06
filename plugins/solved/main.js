const rp = require('request-promise-native')
const debug = require('../../lib/debug.js')
const Barrel = require('../../lib/barrel.js')
const prefix = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Ruby'
]
const number = [
    'V',
    'IV',
    'III',
    'II',
    'I'
]
const kuteki_number = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII'
]
const comma = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const plugin = (bot) => {
    const solvedBarrel = new Barrel('solved')
    const checker = require('./check.js')(bot,solvedBarrel)
    return {
        name: 'solved',
        desc: 'solved.ac와 연동하기 위한 플러그인입니다.',
        load () {
            solvedBarrel.data['level'] = solvedBarrel.data['level'] || {}
            solvedBarrel.save()
            debug.log('solved 플러그인 로드 완료', 2)
            setInterval(checker, 15000)
        },
        guildLoad (guild) {
        },
        message (msg) {
        },
        command (msg, keyword, param) {
        },
        help (msg) {
            msg.channel.send('명령어 호출로 작동하지 않는 플러그인입니다.')
        },
        api: {
            problem: async (problem) => {
                const data = JSON.parse(await rp(`https://api.solved.ac/problem_level.php?id=${problem}`))
                return {
                    tier: (data.level == 0) ? 'Unranked' : prefix[Math.floor((data.level-1)/5)] + ' ' + number[(data.level-1) % 5] + (data.kudeki_level == 0?'':' / Kudeki '+kuteki_number[data.kudeki_level-1]),
                    level: data.level,
                    kudeki_level: data.kudeki_level
                }
            },
            user: async (user) => {
                const data = JSON.parse(await rp(`https://api.solved.ac/user_information.php?id=${user}`))
                return {
                    tier: (data.level == 0) ? 'Unranked' : prefix[Math.floor((data.level-1)/5)] + ' ' + number[(data.level-1) % 5],
                    level: data.level,
                    rawXp: data.exp,
                    xp: comma(data.exp),
                    solved: data.solved
                }
            },
            color: [0xa75618,0x4e608d,0xffae00,0x00ffa1,0x00afff,0xff0042],
            kcolor: 0x9C62D3
        }
    }
}
module.exports = plugin