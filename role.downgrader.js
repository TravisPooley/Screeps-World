const movement = require("helper.movement");

module.exports = {
    run: function(creep) {
        let roomName = creep.memory.target;
        if(!roomName) return;
        if(creep.room.name !== roomName) {
            movement.moveToRoom(creep, roomName);
            return;
        }

        let target = creep.room.controller;
        let result = creep.attackController(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};