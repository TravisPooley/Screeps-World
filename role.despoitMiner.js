const movement = require("helper.movement");

module.exports = {
    run: function(creep) {
        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && creep.carryCapacity == _.sum(creep.carry)) {
            creep.memory.full = true;
        }

        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }

        if (creep.memory["full"]) {
            if(creep.memory.home && creep.room.name !== creep.memory.home) {
                movement.moveToRoom(creep, creep.memory.home);
                return;
            } else if(movement.isOnExit(creep)) {
                movement.leaveExit(creep);
            }
            else {
                if(creep.transfer(creep.room.terminal, _.last(_.keys(creep.store))) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal)
                }
            }
        }
        else {
            if(creep.memory.target && creep.room.name !== creep.memory.target) {
                movement.moveToRoom(creep, creep.memory.target);
                return;
            } else if(movement.isOnExit(creep)) {
                movement.leaveExit(creep);
            }
            else {
                var deposit = creep.room.find(FIND_DEPOSITS)[0];
                if (deposit) {
                    if (creep.harvest(deposit) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(deposit);
                    }
                }
            }
        }
    }
}