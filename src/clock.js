const Clock = class {
    constructor(channel, ms) {
        this.channel = channel
        this.task = []
        this.ms = ms
    }
    addTask(task) {
        this.task.push(setInterval(
            task,
            this.ms
        ))
    }
}
module.exports = Clock