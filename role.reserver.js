module.exports = {
    run: function(creep) {
        var target = Game.getObjectById(creep.memory.target);
        if(!target) return;

        let result = creep.reserveController(target);
        if(result == OK) {
            creep.signController(target, "Bycrome was here");
        } else if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};