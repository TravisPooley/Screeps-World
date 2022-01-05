
const movement = require("helper.movement");

let source;
module.exports = {
    checkCapacity(creep) {
        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && creep.carryCapacity == _.sum(creep.carry)) {
            creep.memory.full = true;
        }

        if (creep.memory["full"] == null) {
            creep.memory.full = false;
        }
    },
    run(creep) {

        if (creep.memory.room && creep.room.name !== creep.memory.room) {
            movement.moveToRoom(creep, creep.memory.room);
            return;
        } else if (movement.isOnExit(creep)) {
            movement.leaveExit(creep);
        }

        source = Game.getObjectById(creep.memory.target);
        module.exports.checkCapacity(creep);

        if (!creep.memory.full) {
            if (creep.room.memory.mineralContainer && creep.room.memory.mineralContainer[creep.memory.target]) {
                let attempt = creep.harvest(source);
                if (attempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                else if (attempt == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.full = true;
                }
                else {
                    // console.log('error harvesting: ' + attempt);
                }
            }
            else {
                module.exports.checkContainer(creep);
            }
            
        }

        module.exports.checkCapacity(creep);

        if (creep.memory.full) {
            if (creep.room.memory.mineralContainer) {
                let store = Game.getObjectById(creep.room.memory.mineralContainer[creep.memory.target]);
                if (!store) {
                    module.exports.checkContainer(creep);
                }
                else {
                    // try transfer to store move if not in range
                    let attempt = creep.transfer(store, _.last(Object.keys(creep.store)));
                    if (attempt == ERR_NOT_IN_RANGE) {
                        creep.moveTo(store);
                    }
                    else {
                        // console.log('error transferring: ' + attempt);
                    }
                }
            }
            else {
                creep.room.memory.mineralContainer = {};
            }

        }
    },

    checkContainer(creep) {
        let container = source.pos.findInRange(FIND_STRUCTURES, 1);
        container = container.filter(structure => structure.structureType == STRUCTURE_CONTAINER).shift();
        
        if (container) {
            creep.room.memory.mineralContainer = {}
            creep.room.memory.mineralContainer[creep.memory.target] = container.id;
            return (true);
        }
        else {
            return (false);
        }
    }
}