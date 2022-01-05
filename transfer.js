
var helper = require('helper');
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.full && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
	    }
	    if(!creep.memory.full && creep.store.getFreeCapacity() == 0) {
	        creep.memory.full = true;
	    }
        if (creep.memory.full == null) {
            creep.memory.full = false;
        }

	    if(creep.memory.full) {
        
            // var test = creep.room.memory.extensions.forEach(id => Game.getObjectById(id));
            // let cpu = Game.cpu.getUsed();
            // var test = [];
            // creep.room.memory.extensions.forEach(id => test.push(Game.getObjectById(id)));
            // console.log(test)
            // console.log(`cpu: ${Game.cpu.getUsed() - cpu}`);

            
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return ((structure.structureType == STRUCTURE_EXTENSION || (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 250 && creep.store[RESOURCE_ENERGY] > 50) || structure.structureType == STRUCTURE_SPAWN) &&  structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });

            if (!target) {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return ((structure.structureType == STRUCTURE_LAB ) &&  structure.store.getFreeCapacity(RESOURCE_ENERGY) > 50);
                    }
                });
            }

            if (!target) {
                creep.say('idle')
                let idle = Game.flags[creep.memory.room+" TRANSFER IDLE"];
                if (idle && creep.pos !== idle.pos) {
                    creep.moveTo(idle.pos);
                }
            }
            else {
                helper.tryElseMove(creep, target, "green", "transfer");
            }
        }
        else {
            if (creep.room.storage && Object.keys(creep.room.storage.store).includes(RESOURCE_ENERGY) && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                helper.tryElseMove(creep, creep.room.storage, "red", "withdraw");
                creep.say('storage')
                return;
            }
            if (creep.room.terminal && Object.keys(creep.room.terminal.store).includes(RESOURCE_ENERGY) && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                    creep.say('terminal')
                    return;
                }
            }
            else {
                let flag = Game.flags[creep.memory.room];
                if (flag) {
                    let dropped = flag.pos.findInRange(FIND_DROPPED_RESOURCES, 7);
                    dropped.sort((a, b) => b.amount - a.amount);
                    if (dropped.length > 0) {
                        if (creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropped[0]);
                        }
                        creep.say("dropped")
                    }
                    else {
                        if (Object.keys(creep.store).includes(RESOURCE_ENERGY)) {
                            creep.memory.full = true;
                        }
                        else {
                            // if (creep.room.find(FIND_ENEMIES).length == 0) {
                                let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                                if (dropped) {
                                    // dropped.sort((a, b) => b.amount - a.amount);
                                    if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(dropped);
                                    }
                                    creep.say("dropped")
                                }
                            // }
                        }
                    }
                }
            }
        }
        
        // else {}
        // else if (creep.ticksToLive < 2 && creep.room.storage) {
        //     helper.tryElseMove(creep, creep.room.storage, "green", "transfer");
        // }
        // else if (creep.ticksToLive < 2 && creep.room.terminal) {
        //     helper.tryElseMove(creep, creep.room.terminal, "green", "transfer");
        // }
    }
};
