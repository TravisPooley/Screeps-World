var helper = require('helper');
const movement = require("helper.movement");

module.exports = {
    transport(creep) {
        if(creep.memory["full"] && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && creep.store.getFreeCapacity() == 0) {
            creep.memory.full = true;
        }

        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }

        if (!creep.memory["full"]) {
            var container = Game.getObjectById(creep.memory.target);
            helper.tryElseMove(creep, container, "#800080", "withdraw");
        }
        else {
            if (Game.rooms[creep.memory.room] && Game.rooms[creep.memory.room].storage != undefined) {
                // let attempt = creep transfer to storage
                let attempt = creep.transfer(Game.rooms[creep.memory.room].storage, RESOURCE_ENERGY);
                if(attempt == ERR_NOT_IN_RANGE) {
                    // creep.say('t')
                    creep.moveTo(Game.rooms[creep.memory.room].storage);
                }
                // else if (attempt == ERR_NO_PATH) {
                //     creep.say('e')
                //     let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {function(structure) {structure.type != STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0}});
                //     helper.tryElseMove(creep, container, "#800080", "transfer");
                // }
            }
            else {
                // find any container in Game.rooms[creep.memory.room]
                if(creep.memory.target && creep.room.name !== creep.memory.room) {
                    movement.moveToRoom(creep, creep.memory.room);
                    return;
                } else if(movement.isOnExit(creep)) {
                    movement.leaveExit(creep);
                }
                else {
                    // find closest container by path
                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0);
                        }
                    });


                    // let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {function(structure) {structure.type == STRUCTURE_CONTAINER && stucture.store.getFreeCapacity() > 0}});
                    // console.log(container)
                    // let container = Game.rooms[creep.memory.room].find(FIND_STRUCTURES, {function(stucture) {stucture.store.getFreeCapacity() > 0}});
                    helper.tryElseMove(creep, container, "#800080", "transfer");
    
                    
                }
                
            }
        }
    
        
    },
    courier(creep){

      
        if(creep.memory["full"] && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && creep.store.getFreeCapacity() == 0) {
            creep.memory.full = true;
        }

        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }

        if (!creep.memory["full"]) {
            helper.AquireEnergy(creep);
        }
        else {
            helper.tryElseMove(creep, creep.room.storage, "#000000", "transfer");
        }
    
    },
    courierII(creep) {

        var storage = Game.getObjectById(creep.memory.storage);
        if(creep.memory.full && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory.full && creep.store.getFreeCapacity() == 0) {
            creep.memory.full = true;
            creep.memory.target = null;
        }
        if (creep.memory.full == null) {
            creep.memory.full = false;
        }
        if(creep.memory.full) {
            if (creep.room.name != storage.room.name) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(storage.room.name)));
            }
            else {
                helper.tryElseMove(creep, storage, "#000000", "transfer");
                creep.memory.target = null;
            }
        }
        else {
            if (creep.room.name != creep.memory.room) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.room)));
            }
            else {
                if (creep.memory.target == null) {
                    var energy = helper.findBestDroppedEnergy(creep.room);
                    if (energy.length > 0) {
                        creep.memory.target = energy[0].id;
                    }
                }
                else {
                    var target = Game.getObjectById(creep.memory.target);
                    if (target == null) {
                        creep.memory.target = null;
                    }
                    else {
                        helper.tryElseMove(creep, target, "#000000", "pickup");
                    }
                }
            }
        }
    },
    courierIII(creep) {
        if(creep.memory.full && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory.full && creep.store.getFreeCapacity() == 0) {
            creep.memory.full = true;
            creep.memory.target = null;
        }
        if (creep.memory.full == null) {
            creep.memory.full = false;
        }
        if(creep.memory.full) {
            if (creep.room.name != creep.memory.to) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.to)));
            }
            else {
                helper.tryElseMove(creep, creep.room.storage, "#000000", "transfer");
            }
        }
        else {
            if (creep.room.name != creep.memory.from) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.from)));
            }
            else {
                
                var storage = Game.getObjectById(creep.room.memory.storage);
                helper.tryElseMove(creep, storage, "#000000", "withdraw");
            }
        }
    },
}