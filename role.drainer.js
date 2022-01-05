const movement = require("helper.movement");
const boosting = require("helper.boosting");

module.exports = {
    run: function(creep) {

        if (creep.ticksToLive == undefined) {
            return
        }

        if(creep.ticksToLive == CREEP_LIFE_TIME - 1) creep.notifyWhenAttacked(false);

        // if (Game.time%2==0) {
        //     creep.say("testing", true);
        // }
        // else {
        //     creep.say("new script", true);
        // }
        
        
        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }

        let targetName = creep.memory.target;
        if(creep.room.name !== targetName) {
            if(creep.hits == creep.hitsMax) {
                creep.say("🚶");
                movement.moveToRoom(creep, targetName);
            } else {
                creep.say("l");
                if (!movement.leaveExit(creep)) {
                    creep.say('e')
                    if(creep.pos.x < 5 || creep.pos.x > 45 || creep.pos.y < 5 || creep.pos.y > 45) {
                        movement.moveToRoom(creep, creep.room.name);
                    }
                }
            }
        } else {
            let damageTaken = creep.memory.lastHits - creep.hits;
            if(creep.hits <= damageTaken * 4) {
            //     console.log("suggest run");
            // }

            // if(creep.getActiveBodyparts(TOUGH) < 1) {
                creep.say("💀");
                module.exports.moveOut(creep);
            } else {
                creep.say("💉");
                movement.leaveExit(creep);
            }
        }
        creep.memory.lastHits = creep.hits;
    },
    moveOut: function(creep) {
        creep.say("t");
        if(creep.pos.x == 1) {
            creep.move(LEFT);
        } else if(creep.pos.x == 48) {
            creep.move(RIGHT);
        } else if(creep.pos.y == 1) {
            creep.move(TOP);
        } else if(creep.pos.y == 48) {
            creep.move(BOTTOM);
        } else {
            // creep somehow got deeper than expected
            creep.move(creep.pos.getDirectionTo(creep.pos.findClosestByRange(FIND_EXIT)));
        }
    }
};