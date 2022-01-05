module.exports = {
    run(room) {
        if (Memory.global.communes.length == Game.gcl.level) return;
        if (Memory.global.communes.length >= (Game.cpu.limit/6.66666).toFixed()) return;
        let flag = Game.flags[room.name+" EXPANSION"];
        if (!flag) return;
        else {
            return("spawn");
        }
    },
}