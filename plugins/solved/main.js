const rp = require('request-promise-native')
const debug = require('../../lib/debug.js')
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
    return {
        name: 'solved',
        desc: 'solved.ac와 연동하기 위한 플러그인입니다.',
        load () {
            debug.log('solved 플러그인 로드 완료', 2)
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
                if (data.level == 0) return 'Unranked'
                return prefix[Math.floor((data.level-1)/5)] + ' ' + number[(data.level-1) % 5] + (data.kudeki_level == 0?'':' / Kudeki '+kuteki_number[data.kudeki_level-1])
            },
            user: async (user) => {
                const data = JSON.parse(await rp(`https://api.solved.ac/user_information.php?id=${user}`))
                if (data.level == 0) return 'Unranked'
                return {
                    tier: prefix[Math.floor((data.level-1)/5)] + ' ' + number[(data.level-1) % 5],
                    rawXp: data.exp,
                    xp: comma(data.exp),
                    solved: data.solved
                }
            }
        }
    }
}
module.exports = plugin