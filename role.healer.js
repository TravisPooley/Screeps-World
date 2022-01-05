const movement = require("helper.movement");
const boosting = require("helper.boosting");

module.exports = {
    run(creep) {
        if(creep.ticksToLive == CREEP_LIFE_TIME - 1) creep.notifyWhenAttacked(false);

        // todo impliment

        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }

        let target = Game.creeps[creep.memory.target];
        if(!target || (creep.hits < creep.hitsMax && creep.hits < target.hits)) {
            module.exports.heal(creep, creep);
            if(target) {
                if(creep.pos.isNearTo(target)) {
                    module.exports.moveWhileNearTarget(creep, target);
                } else {
                    if(!creep.memory.avoidRooms || !creep.memory.avoidRooms.includes(target.room.name)) {
                        // replace
                        //creep.goTo(target);
                        creep.moveTo(target);
                    }
                }
            }
            return;
        }

        if(target) {
            module.exports.heal(creep, target);
        } else {
            module.exports.findNewTarget(creep);
        }

        
        // if(target) {
        //     if (target.hits < target.hitsMax) {
        //         module.exports.heal(creep, target);
        //     }
        //     else if (creep.hits < creep.hitsMax) {
        //         module.exports.heal(creep, creep);
        //     }
        // } else {
        //     module.exports.findNewTarget(creep);
        // }
    },
    heal(creep, target) {
        let healResult = creep.heal(target);
        if(healResult === OK) {
            module.exports.moveWhileNearTarget(creep, target);
        } else if(healResult == ERR_NOT_IN_RANGE) {
            creep.rangedHeal(target);
            if(!creep.memory.avoidRooms || !creep.memory.avoidRooms.includes(target.room.name)) {
                // replace
                //creep.goTo(target);
                creep.moveTo(target);
            }
        }
    },
    findNewTarget(creep) {
        let newTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax });
        if(!newTarget) return;

        creep.memory.target = newTarget.name;
    },
    moveWhileNearTarget(creep, target) {
        let exitDir = movement.getExitDirection(target);
        if(exitDir) {
            // Being near, when target is on the exit tile can only happen when
            // the target arrived in this room, when we were already there.
            // Clear the exit to avoid us blocking targets movement off the exit.
            creep.move(movement.inverseDirection(exitDir));
        } else {
            // instantly follow to keep up with target
            creep.move(creep.pos.getDirectionTo(target));
        }
    }
}