var helper = require('helper');

module.exports = {
    reserver(creep){
        // if target is defined and creep is not in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
            return;
        }
        if (creep.memory.target != undefined && creep.room.name == creep.memory.target) {
            var controller = creep.room.controller;
            // if(creep.room.controller && !creep.room.controller.my) {
            //     if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(creep.room.controller);
            //     }
            // }
            // else if(controller) {
                if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
                }

                if (creep.memory.claim) {
                    if(creep.claimController(controller) == ERR_NOT_IN_RANGE){
                        creep.moveTo(controller, {visualizePathStyle: {stroke: '#cc00cc'}});
                    }
                }
            // }
        }

        // if there is no target set
        if (creep.memory.target == undefined) {
            creep.memory.target = creep.room.name;
        }
    }
}