const movement = require("helper.movement");
const helper = require('helper');
const c = require("config");
// STRUCTURE_TERMINAL
// 
const highPriorityStructures = [STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_EXTENSION, STRUCTURE_EXTRACTOR];

module.exports = {
    run: function(creep) {
        if(creep.memory.target && creep.room.name !== creep.memory.target) {
            movement.moveToRoom(creep, creep.memory.target);
            return;
        } else if(movement.isOnExit(creep)) {
            movement.leaveExit(creep);
        }

        if(creep.memory.building && creep.store.energy == 0) {
            creep.memory.building = false;
            creep.memory.lastTarget = null;
        }
        if(!creep.memory.building && creep.store.energy == creep.store.getCapacity()) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var target = module.exports.chooseTarget(creep);
            module.exports.constructOrRepair(creep, target);
        }
        else {
            module.exports.harvestEnergy(creep);
        }
    },
    chooseTarget: function(creep) {
        let lastTarget = Game.getObjectById(creep.memory.lastTarget);
        if(lastTarget) {
            if(module.exports.isConstructionSite(lastTarget) || (!module.exports.isConstructionSite(lastTarget) && lastTarget.hits < lastTarget.hitsMax)) {
                return lastTarget;
            }
        }

        let constructions = _.sortBy(creep.room.find(FIND_MY_CONSTRUCTION_SITES), (cs) => cs.pos.getRangeTo(creep.pos));
        let target = module.exports.findEmergencyRepairTarget(creep) ||
                     module.exports.findHighPriorityConstructionTarget(creep, constructions) ||
                     module.exports.findNormalPriorityConstructionTarget(creep, constructions) ||
                     module.exports.findLowPriorityConstructionTarget(creep, constructions) ||
                     module.exports.findNormalRepairTarget(creep);

        return target;
    },
    findHighPriorityConstructionTarget: function(creep, constructions) {
        return _.find(constructions, (cs) => highPriorityStructures.includes(cs.structureType));
    },
    findNormalPriorityConstructionTarget: function(creep, constructions) {
        let terrain = creep.room.getTerrain();
        return _.find(constructions, (cs) => (cs.structureType !== STRUCTURE_ROAD || terrain.get(cs.pos.x, cs.pos.y) === TERRAIN_MASK_SWAMP) && cs.structureType != STRUCTURE_RAMPART);
    },
    findLowPriorityConstructionTarget: function(creep, constructions) {
        return _.find(constructions, (cs) => cs.structureType == STRUCTURE_ROAD || cs.structureType == STRUCTURE_RAMPART);
    },
    findNormalRepairTarget: function(creep) {
        let supplyNominal = creep.room.storage && creep.room.storage.store.energy >= 10000;
        var targets = creep.room.find(FIND_STRUCTURES, { filter: function(structure) {
            return structure.hits < structure.hitsMax &&
                    (supplyNominal || structure.hits < (structure.hitsMax/2)) &&
                    (structure.structureType != STRUCTURE_ROAD || (structure.hits / structure.hitsMax <= 0.8)) &&
                    structure.structureType != STRUCTURE_CONTROLLER;
        } });
        if(targets.length > 0) {
            return _.sortBy(targets, (t) => t.hits / _.min([t.hitsMax, (t.hitsMax/2)]))[0];
        }

        return null;
    },
    findEmergencyRepairTarget: function(creep) {
        // here probably
        var targets = creep.room.find(FIND_STRUCTURES, { filter: function(structure) {
            return structure.hits < module.exports.emergencyHitpoints(structure) &&
                    structure.hits < (structure.hitsMax/2) &&
                    structure.structureType != STRUCTURE_CONTROLLER;
        } });
        if(targets.length > 0) {
            var targetsByDistance = _.sortBy(targets, (t) => creep.pos.getRangeTo(t));
            return _.sortBy(targetsByDistance, (t) => t.hits)[0];
        }

        return null;
    },
    emergencyHitpoints: function(structure) {
        if(structure.structureType == STRUCTURE_CONTAINER) {
            return 10000;
        } else {
            return 1500;
        }
    },
    constructOrRepair: function(creep, target) {
        if(!target) {
            creep.memory.stopped = true;
            return;
        }
        var result;

        if(module.exports.isConstructionSite(target)) {
            result = creep.build(target);
        } else {
            result = creep.repair(target);
        }


        if(result == OK) {
            // lock onto target as soon as actual work is happening
            creep.memory.lastTarget = target.id;
            creep.memory.stopped = true;
        } else if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { range: 3 });
            creep.memory.stopped = false;
        }
    },
    isConstructionSite: function(target) {
        return !target.hits;
    },
    harvestEnergy: function(creep) {
        // if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 50000) {
        if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 2000) {
            helper.tryElseMove(creep, creep.room.storage, "red", "withdraw");
        }
        else if (creep.room.memory.containers) {
            // find closeset container with energy
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 1000);
                }
            });
            if (container) {
                helper.tryElseMove(creep, container, "red", "withdraw");
            }
            else {
                let active = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES_ACTIVE));
                if (active) {
                    helper.tryElseMove(creep, active, "yellow", "harvest");
                }
                else {
                    let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (dropped) {
                        // dropped.sort((a, b) => b.amount - a.amount);
                        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropped);
                        }
                        creep.say("dropped")
                    }
                    else {
                        if (Object.keys(creep.store).includes(RESOURCE_ENERGY)) {
                            creep.memory.full = true;
                        }
                    }
                }
            }
        }
        else {
            helper.tryElseMove(creep, creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES_ACTIVE)), "yellow", "harvest");
        }
    }
};
