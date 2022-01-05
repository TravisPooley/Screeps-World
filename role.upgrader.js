const movement = require("helper.movement");
const boosting = require("helper.boosting");
const helper = require('helper');

module.exports = {
    run: function(creep) {

        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }

        if(creep.memory.room && creep.room.name !== creep.memory.room) {
            movement.moveToRoom(creep, creep.memory.room);
            return;
        } else if(movement.isOnExit(creep)) {
            movement.leaveExit(creep);
        }

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }
        if (creep.memory.upgrading == null) {
            creep.memory.upgrading = false;
        }
	    if(creep.memory.upgrading) {
            if (helper.GetAmountOfRoleWithRoom("Transfer", creep.room.name) == 0 && creep.room.energyCapacityAvailable !== creep.room.energyAvailable) {
                creep.say('Transfer')
                require('transfer').run(creep);
                return;
            }
            helper.tryElseMove(creep, creep.room.controller, "red", 'upgradeController');
        }
        else {
            // if (creep.room.memory.controllerLink) {
            //     // var controllerLink = Game.getObjectById(creep.room.memory["controllerLink"]);

            //     // if (controllerLink == null) {
            //     //     creep.room.memory["controllerLink"] = undefined;
            //     // }

            //     // if (controllerLink.store.energy > creep.store.getCapacity()) {
            //     //     helper.tryElseMove(creep, controllerLink, "red", "withdraw");
            //     // }
            //     // else 
            //     if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 20000) {
            //         helper.tryElseMove(creep, creep.room.storage, "red", "withdraw");
            //     }
            //     else {
            //         module.exports.AquireEnergy(creep);
            //     }
            // }
            // else
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 20000) {
                helper.tryElseMove(creep, creep.room.storage, "red", "withdraw");
            }
            else {
                module.exports.AquireEnergy(creep);
            }
        }
    },


    AquireEnergy: function(creep) {
        if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 5000) {
            if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        else if (creep.room.memory.containers) {
            // find closeset container with energy
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 750);
                }
            });
            if (container) {
                helper.tryElseMove(creep, container, "red", "withdraw");
            }
            else {
                helper.tryElseMove(creep, creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES_ACTIVE)), "yellow", "harvest");
            }

        }
        else {
            helper.tryElseMove(creep, creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES_ACTIVE)), "yellow", "harvest");
        }

        // var container = Game.getObjectById(creep.memory.target);
        // if (container && container.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()) {
        //     helper.tryElseMove(creep, container, "red", "withdraw");
        //     creep.memory.container = undefined;
        // }
        // else {
        //     creep.memory.container = undefined;
        //     helper.tryElseMove(creep, creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES_ACTIVE)), "yellow", "harvest");
        // }
    }
};
