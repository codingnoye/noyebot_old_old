const {RichEmbed} = require('discord.js')
const Vote = class {
    constructor (bot, cid, name, msg, choices, ismulti=false) {
        this.bot = bot
        this.name = name
        this.choices = []
        for (let choice of choices){
            this.choices.push({name: choice, value: 0})
        }
        this.ismulti = ismulti
        if (this.ismulti) {
            this.voted = {}
        } else {
            this.voted = []
        }
        this.cid = cid
        this.msg = msg
        bot.client.channels.get(cid).send(this.makeMessage()).then((msg)=>{this.chart = msg})
    }
    vote (uid, index) {
       if (this.ismulti) {
        if (typeof this.voted[uid] == "undefined") {
            this.voted[uid] = []
        }
        if (!this.voted[uid].includes(index)) {
            this.choices[index-1].value ++
            this.voted[uid].push(index)
            this.chart.delete()
            this.bot.client.channels.get(this.cid).send(this.makeMessage()).then((msg)=>{this.chart = msg})
        }
       } else {
        if (!this.voted.includes(uid)) {
            this.choices[index-1].value ++
            this.voted.push(uid)
            this.chart.delete()
            this.bot.client.channels.get(this.cid).send(this.makeMessage()).then((msg)=>{this.chart = msg})
        }
       }
    }
    addChoice (choice) {
        this.choices.push({name: choice, value: 0})
        this.chart.delete()
        this.bot.client.channels.get(this.cid).send(this.makeMessage()).then((msg)=>{this.chart = msg})
    }
    makeMessage () {
        const embed = new RichEmbed()
        .setTitle(`**${this.name}**`)
        .setAuthor(`${this.msg.author.username}님의 투표${this.ismulti?" (복수선택 가능)":""}`)
        let i=1
        for (let choice of this.choices) {
            embed.addField(`${i++}. ${choice.name}`, `현재 ${choice.value}표`)
        }
        return embed
    }
    end () {
        const embed = new RichEmbed()
        .setTitle(`**${this.name}**`)
        .setAuthor(`${this.msg.author.username}님의 투표가 종료되었습니다!`)
        let i=1
        let mx = {name: '에러', value: -1};
        for (let choice of this.choices) {
            embed.addField(`${i++}. ${choice.name}`, `${choice.value}표`)
            mx = (choice.value>mx.value)?choice:mx
        }
        embed.addField(`투표 결과`,`**${mx.name}** : ${mx.value}표`)
        this.bot.client.channels.get(this.cid).send(embed)
    }
}
module.exports = Vote