module.exports = {
    func : (bot, msg, param)=>{
        if (param.length>0) {

        } else {
            for (packageName in bot.packages) {
                const package = bot.packages[packageName]
                package.help(msg)
            }
        }
    },
    keyword : 'help',
    help : '도움말을 확인합니다.',
    args : '?package'
}