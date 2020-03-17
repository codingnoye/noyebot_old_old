module.exports = {
    func : (bot, msg, param)=>{
        for (packageName in bot.packages) {
            const package = bot.packages[packageName]
            package.help(msg)
        }
    },
    keyword : 'help',
    help : '도움말을 확인합니다.'
}