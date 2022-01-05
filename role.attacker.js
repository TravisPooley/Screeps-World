const boosting = require("helper.boosting");
const movement = require("helper.movement");
const enemy = require("helper.allyManager");
const helper = require('helper');

const prioritizedStructures = [STRUCTURE_SPAWN, STRUCTURE_TOWER];

module.exports = {
    run: function(creep) {
        if(creep.ticksToLive == CREEP_LIFE_TIME - 1) creep.notifyWhenAttacked(false);

        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }
        // let target = AbsolutePosition.deserialize(creep.memory.target);
        
        // console.log(creep.memory.target)

        let target = new RoomPosition(25, 25, creep.memory.target);

        if(creep.room.name === target.roomName) {
            module.exports.attackRoom(creep, target);
        } else {
            module.exports.approachRoom(creep, target);
        }
    },
    approachRoom: function(creep, position) {
        // TODO: waiting (somewhere) blocks aggressive move... creep does not attack, because healer is out of range
        if(!module.exports.shouldWait(creep)) {
            //     creep.goTo(position);
            creep.moveTo(position);
        }


        // let target = enemy.findClosestHostileByRange(creep.pos);
        
        let target = enemy.findClosestHostileByRange(creep.pos);


        if(target && creep.pos.isNearTo(target)) {
            creep.attack(target);
        }
    },
    attackRoom: function(creep, position) {
        let target;

        if (prioritizedStructures.length > 0) {
            for(let structureType of prioritizedStructures) {
                if(target) break;
                target = enemy.findClosestStructureByRange(creep.pos, { filter: (s) => s.structureType == structureType });
            }
        }


        
        if(!target) {
            target = enemy.findClosestHostileByRange(creep.pos, { filter: (c) => c.pos.x != 0 || c.pos.x != 49 || c.pos.y != 49 || c.pos.y != 0});
        }

        if(!target) {
            target = enemy.findClosestStructureByRange(creep.pos, { filter: (s) => s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_RAMPART});
        }
        

        // console.log("att",target)
        if(target) {
            module.exports.attack(creep, target);
        } else {
            module.exports.aggressiveMove(creep, position);
        }
    },
    attack: function(creep, target) {
        let result = creep.attack(target);
        if(result == ERR_NOT_IN_RANGE) {
            module.exports.aggressiveMove(creep, target);
        }
    },
    aggressiveMove: function(creep, target) {
        if(module.exports.shouldWait(creep)) return;

        if(creep.moveTo(target, { maxRooms: 1, reusePath: CREEP_LIFE_TIME }) === ERR_NO_PATH) {
            creep.moveTo(target, { ignoreDestructibleStructures: true, maxRooms: 1, reusePath: CREEP_LIFE_TIME });
        }

        if(creep.memory._move && creep.memory._move.path) {
            let nextStep = Room.deserializePath(creep.memory._move.path)[0];
            // let moveTarget = _.find(creep.room.lookForAt(LOOK_STRUCTURES, creep.room.getPositionAt(nextStep.x, nextStep.y)), (s) => s.structureType === STRUCTURE_WALL || ff.isHostile(s));
            let moveTarget = _.find(creep.room.lookForAt(LOOK_STRUCTURES, creep.room.getPositionAt(nextStep.x, nextStep.y)), (s) => s.structureType === STRUCTURE_WALL );
            if(!moveTarget) {
                moveTarget = _.find(creep.room.lookForAt(LOOK_CREEPS, creep.room.getPositionAt(nextStep.x, nextStep.y)),(c) => c.owner.username != Memory["Username"]);
            }

            if(!moveTarget) {
                // let closeHostiles = _.filter(ff.findHostiles(creep.room), (c) => c.pos.isNearTo(creep));
                let closeHostiles = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), (c) => c.pos.isNearTo(creep));
                moveTarget = closeHostiles[0];
            }
            // console.log('mov',moveTarget)
            if(moveTarget) {
                creep.attack(moveTarget);
            }
        }
    },
    shouldWait: function(creep) {
        if(movement.isOnExit(creep)) return false;

        // console.log(creep.memory.waitFor && creep.room.controller && creep.room.controller.my)
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
                let medicSize = null;
                if (creep.memory.maxSize) medicSize = creep.memory.maxSize;
                helper.spawn(spawns, helper.BuildBody([MOVE, HEAL], creep.room, medicSize), name, { memory: { role: 'healer', target: creep.name}});
                // helper.spawn(spawns, helper.BuildBody([TOUGH, MOVE, MOVE, MOVE, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                return true;
            }
        }

        let waitFor = Game.creeps[creep.memory.waitFor];
       
        if(!waitFor) return false;

        return !creep.pos.isNearTo(waitFor);
    }
};