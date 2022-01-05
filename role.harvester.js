
const movement = require("helper.movement");

let source;
module.exports = {
    checkCapacity(creep) {
        // if full
        if(creep.memory["full"] && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && creep.store.getFreeCapacity() < 12) {
            creep.memory.full = true;
        }

        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }
    },
    run(creep) {
        
        if(creep.memory.room && creep.room.name !== creep.memory.room) {
            movement.moveToRoom(creep, creep.memory.room);
            return;
        } else if(movement.isOnExit(creep)) {
            movement.leaveExit(creep);
        }

        // note change the memory to store the id instead of the whole target object
        source = Game.getObjectById(creep.memory.target);
        
        module.exports.checkCapacity(creep);
        
        

        // if (creep.room.memory.sourceDistance == undefined || creep.room.memory.sourceDistance[creep.memory.target] == undefined) {
        //     module.exports.checkDistance(creep);
        // }

        // if (creep.ticksToLive && creep.room.memory.sourceDistance[creep.memory.target] && creep.ticksToLive < 150 && creep.ticksToLive-43 < creep.room.memory.sourceDistance[creep.memory.target]){
        //     creep.memory.role = "closeDeathEfficientHarvester";
        //     module.exports.checkDistance(creep);
        // }

        if (creep.room.memory.sourceContainers[creep.memory.target] == undefined) {
            module.exports.buildContainer(creep);
        }

        if (!creep.memory.full) {

            // if (source.energy == 0) return;
            
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            
            if (creep.room.memory.sourceContainers) {
                let store = Game.getObjectById(creep.room.memory.sourceContainers[creep.memory.target]);
                if (store && store.hits < store.hitsMax) {
                    creep.repair(store);
                }
            }
        }

        module.exports.checkCapacity(creep);
        
        if (creep.memory.full) {

            if (creep.room.memory.sourceLinks[creep.memory.target] && (creep.room.memory.mainLink != undefined || creep.room.memory.controllerLink != undefined)) {
                let link = source.pos.findInRange(FIND_MY_STRUCTURES, 2).filter(a => a.structureType == STRUCTURE_LINK)[0];
                module.exports.store(creep, STRUCTURE_LINK, link);
            }
            else if (creep.room.memory.sourceContainers) {
                let store = Game.getObjectById(creep.room.memory.sourceContainers[creep.memory.target]);
                module.exports.store(creep, STRUCTURE_CONTAINER, store);
            }
            else {
                creep.drop(RESOURCE_ENERGY);
            }
        }
    },

    checkDistance(creep) {
        if (creep.room.memory.sourceDistance == undefined) {
            creep.room.memory.sourceDistance = {};
        }
        creep.room.memory.sourceDistance[creep.memory.target] = (source.pos.findPathTo(Object.values(Game.spawns).filter(spawn => spawn.room == creep.room).shift[0], {ignoreCreeps: true}).length);
    },
    store(creep, type, store) {
        if (store != null) {
            if (store.hits < store.hitsMax) {
                creep.repair(store);
            }
            else {
                let result = creep.transfer(store, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(store);
                }
                else if (result == ERR_FULL) {
                    if (store.hits < store.hitsMax) {
                        creep.repair(store);
                    }
                    else {
                        creep.drop(RESOURCE_ENERGY);
                    }
                }
            }
        }
        else {
            if (type == STRUCTURE_CONTAINER) {
                creep.room.memory.sourceContainers[creep.memory.target] = undefined;
            }
            if (type == STRUCTURE_LINK) {
                creep.room.memory.sourceLinks[creep.memory.target] = undefined;
            }
        }
    },
    buildContainer(creep) {
        if (!module.exports.checkContainer(creep)) {
            const constructionSite = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1).shift();
            if(constructionSite) {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } 
            // else {
            //     if (!creep.pos.findInRange(FIND_SOURCES, 1)) return;
            //     let result = creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
            //     if (result === ERR_INVALID_TARGET) {
            //         module.exports.checkContainer(creep);
            //     }
            // }
        }
    },
    
    checkContainer(creep){
        let container = source.pos.findInRange(FIND_STRUCTURES, 1);
        container = container.filter(structure => structure.structureType == STRUCTURE_CONTAINER).shift();
        if (container) {
            creep.room.memory.sourceContainers[creep.memory.target] = container.id;
            return(true);
        }
        else {
            return(false);
        }
    }

};