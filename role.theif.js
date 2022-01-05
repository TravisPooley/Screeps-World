const movement = require("helper.movement");
const parkStructures = [STRUCTURE_STORAGE, STRUCTURE_POWER_BANK, STRUCTURE_CONTAINER, STRUCTURE_TERMINAL];


module.exports = {
    run: function(creep) {
        
        if(creep.ticksToLive == CREEP_LIFE_TIME - 1) creep.notifyWhenAttacked(false);

        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }



        if (creep.store.getUsedCapacity() == 0) {

            creep.memory.full = false
    
        } else if (creep.store.getUsedCapacity() == creep.store.getCapacity()) {
    
            creep.memory.full = true
        }
        else if (creep.memory.full == undefined) {
            creep.memory.full = false
        }
        
        if (!creep.memory["full"]) {
            if(creep.memory.target && creep.room.name !== creep.memory.target) {
                movement.moveToRoom(creep, creep.memory.target);
                return;
            }
            else if(movement.isOnExit(creep)) {
                movement.leaveExit(creep);
            }
            else {
                let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(!target) target = creep.pos.findClosestByRange(FIND_TOMBSTONES, { filter: (t) => _.sum(t.store) > 0 });
                if(!target && (!creep.room.controller || (creep.room.controller && !creep.room.controller.my))) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => parkStructures.includes(s.structureType) && _.sum(s.store) > 0 });
                }
        
                if(!target) {
                    if(_.sum(creep.store) > 0) {
                        creep.memory.full = true;
                    } else {
                        // Wait at a parking position.
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                            { filter: (s) => parkStructures.includes(s.structureType) });
                        if(!target) target = { pos: creep.room.getPositionAt(25, 25) };
                        if(creep.pos.getRangeTo(target) <= 5) {
                            creep.memory.stopped = true;
                        } else {
                            creep.memory.stopped = false;
                            creep.goTo(target, { range: 5, ignoreRoads: true, avoidHostiles: true });
                        }
                    }
                }
        
                let result = null;
                if(target.store) {
                    result = creep.withdraw(target, _.last(Object.keys(target.store)));
                } else {
                    result = creep.pickup(target);
                }
    
                if(creep.store.getFreeCapacity() == 0) {
                    creep.memory.full = true;
                }
            }
        }

        if (creep.memory["full"]) {
            if(creep.memory.room && creep.room.name !== creep.memory.room) {
                movement.moveToRoom(creep, creep.memory.room);
                return;
            }
            else if(movement.isOnExit(creep)) {
                movement.leaveExit(creep);
            }
            else {
                if (creep.room.terminal) {
                    if(creep.transfer(creep.room.terminal, _.last(_.keys(creep.store))) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.terminal);
                }
                else if (creep.room.storage) {
                    if(creep.transfer(creep.room.storage, _.last(_.keys(creep.store))) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.storage);
                }
                else {
                    creep.say('no storage');
                }
            }
        }
      
    },
}