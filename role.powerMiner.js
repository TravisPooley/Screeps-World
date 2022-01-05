const movement = require("helper.movement");
const helper = require('helper');

module.exports = {
    run: function(creep) {

        if(creep.room.name !== creep.memory.targetRoom && !module.exports.shouldWait(creep)) {
            movement.moveToRoom(creep, creep.memory.targetRoom);
            return;
        }
        else {
            let target = Game.getObjectById(creep.memory.target);

            if(target) {
                module.exports.attackBank(creep, target);
            } else {
                module.exports.clearPath(creep);
            }
        }
    },
    attackBank: function(creep, target) {
        let returnDamage = POWER_BANK_HIT_BACK * ATTACK_POWER * creep.getActiveBodyparts(ATTACK);

        if(returnDamage >= creep.hits) return;

        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },
    clearPath: function(creep) {
        let resources = creep.room.find(FIND_DROPPED_RESOURCES);
        if(resources.length === 0) return;
        creep.fleeFrom(resources, 4);
    },
    shouldWait: function(creep) {

        
        console.log(creep.memory.waitFor)

        if(movement.isOnExit(creep)) return false;

        if(creep.room.controller && creep.room.controller.my) {
            // automatically rally close to the room border
            if(movement.isWithin(creep, 5, 5, 45, 45)) return false;
        }


        if(creep.memory.waitFor && creep.room.controller && creep.room.controller.my) {
            console.log("power miner " + creep.name + " waiting for follower to be spawned. (" + creep.room.name + ")");
            if (helper.GetAmountOfRoleTargeting("healer", creep.name) < 1) {
                creep.say("need medic");
                var spawns = Object.values(Game.spawns).filter(spawn => spawn.room == creep.room);
                var name = helper.nameScreep("Medic")
                creep.memory.waitFor = name;
                helper.spawn(spawns, helper.BuildBody([MOVE, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                return true;
            }
        }
        else {
            return false;
        }

        let waitFor = Game.creeps[creep.memory.waitFor];
        if(!waitFor) return false;

        return !creep.pos.isNearTo(waitFor);
    }
};