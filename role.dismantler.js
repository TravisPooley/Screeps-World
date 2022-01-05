const boosting = require("helper.boosting");
// const ff = require("helper.friendFoeRecognition");
const movement = require("helper.movement");
const helper = require('helper');

const prioritizedStructures = [STRUCTURE_SPAWN, STRUCTURE_TOWER];
const blacklistedStructures = [];

module.exports = {
    run: function(creep) {


        if (Game.time % 2 == 0) {
            creep.say('testing', true)
        }
        else {
            creep.say('new script', true)
        }
        
        if (creep.ticksToLive == undefined) {
            return
        }

        if(creep.ticksToLive == CREEP_LIFE_TIME - 1) creep.notifyWhenAttacked(false);

        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }

        // let target = AbsolutePosition.deserialize(creep.memory.target);
        
        // console.log(creep.memory.target)


        // if(creep.pos.roomName == target.roomName) {
        //     module.exports.attackRoom(creep, target);
        // } else {
        //     module.exports.approachRoom(creep, target);
        // }


        let targetName = creep.memory.target;
        if(creep.room.name !== targetName) {
            if(!module.exports.shouldWait(creep)) {
                movement.moveToRoom(creep, targetName);
            }
        }
        else {
            let target = new RoomPosition(25, 25, creep.memory.target);
            module.exports.attackRoom(creep, target);
        }
    },
    approachRoom: function(creep, position) {
        if(!module.exports.shouldWait(creep)) {
            // creep.goTo(position);
            creep.moveTo(position);
        }
    },
    attackRoom: function(creep, position) {

        if (creep.memory.pirority && creep.memory.pirority.length > 0) {
            var target = Game.getObjectById(creep.memory.pirority);
            if (target == null) {
                creep.memory.pirority = ""
            }
        }
        else {
            var target = creep.pos.lookFor(LOOK_STRUCTURES)[0];

            for(let structureType of prioritizedStructures) {
                if(target) break;
                target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType == structureType });
            }
    
            if(!target) {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType != STRUCTURE_CONTROLLER && s.structureType !== STRUCTURE_RAMPART && !blacklistedStructures.includes(s.structureType) });
            }
    
            if(!target) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType !== STRUCTURE_CONTROLLER && !blacklistedStructures.includes(s.structureType) });
            }
        }



        if(target) {
            module.exports.attack(creep, target);
        } else {
            module.exports.aggressiveMove(creep, position);
        }
    },
    attack: function(creep, target) {
        let result = creep.dismantle(target);
        if(result == ERR_NOT_IN_RANGE) {
            if(!module.exports.aggressiveMove(creep, target)) {
                let temporaryTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType != STRUCTURE_CONTROLLER });
                if(creep.pos.isNearTo(temporaryTarget)) {
                    creep.dismantle(temporaryTarget);
                }
            }
        }
    },
    aggressiveMove: function(creep, target) {
        if(module.exports.shouldWait(creep)) return false;

        if(creep.moveTo(target, { maxRooms: 1, reusePath: CREEP_LIFE_TIME }) === ERR_NO_PATH) {
            creep.moveTo(target, { ignoreDestructibleStructures: true, maxRooms: 1, reusePath: CREEP_LIFE_TIME });
        }

        if(creep.memory._move.path) {
            let nextStep = Room.deserializePath(creep.memory._move.path)[0];
            let moveTarget = _.find(creep.room.lookForAt(LOOK_STRUCTURES, creep.room.getPositionAt(nextStep.x, nextStep.y)), (s) => s.structureType == STRUCTURE_WALL);

            if(moveTarget) {
                creep.dismantle(moveTarget);
                return true;
            }
        }

        return false;
    },
    shouldWait: function(creep) {
        if(movement.isOnExit(creep)) return false;

        if(creep.room.controller && creep.room.controller.my) {
            // automatically rally close to the room border
            if(movement.isWithin(creep, 5, 5, 45, 45)) return false;
        }


        if(!!creep.memory.waitFor && creep.room.controller && creep.room.controller.my) {
            console.log("Attacker " + creep.name + " waiting for follower to be spawned. (" + creep.room.name + ")");
            if (helper.GetAmountOfRoleTargeting("healer", creep.name) < 1) {
                creep.say("need medic")
                var spawns = Object.values(Game.spawns).filter(spawn => spawn.room == creep.room);
                var name = helper.nameScreep("Medic")
                creep.memory.waitFor = name;
                helper.spawn(spawns, helper.BuildBody([MOVE, HEAL, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                // helper.spawn(spawns, helper.BuildBody([TOUGH, MOVE, MOVE, MOVE, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                return true;
            }
        }

        let waitFor = Game.creeps[creep.memory.waitFor];
       
        if(!waitFor) return false;

        return !creep.pos.isNearTo(waitFor);
    }
};