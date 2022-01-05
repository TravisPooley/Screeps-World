const roomNuker = require('room.nuker');

module.exports = {
    run: function(creep) {
        if (creep.ticksToLive == undefined) {
            return
        }

        if(!creep.room.terminal || !creep.room.nuker()) {
            console.log("Nuke operator in room " + creep.room.name + " is either missing storage or nuker.");
            return;
        }

        if(_.sum(creep.store) > 0) {
            module.exports.carryToNuker(creep);
        } else {
            module.exports.pickupResource(creep);
        }
    },

    carryToNuker: function(creep) {
        if(creep.pos.isNearTo(creep.room.nuker())) {
            creep.transfer(creep.room.nuker(), _.last(_.keys(creep.store)));
        } else {
            creep.goTo(creep.room.nuker());
        }
    },

    pickupResource: function(creep) {
        if(creep.pos.isNearTo(creep.room.terminal)) {
            let missingEnergy = creep.room.nuker().store.getFreeCapacity(RESOURCE_ENERGY);
            let missingGhodium = creep.room.nuker().store.getFreeCapacity(RESOURCE_GHODIUM);
            let resource = missingGhodium > 0 ? RESOURCE_GHODIUM : RESOURCE_ENERGY;
            if(missingEnergy > 0 || missingGhodium > 0) {
                let amount = Math.min(creep.store.getCapacity(), creep.room.terminal.store[resource], resource === RESOURCE_GHODIUM ? missingGhodium : missingEnergy);
                creep.withdraw(creep.room.terminal, resource, amount);
            } else {
                console.log(creep.name + " has completed it job!")
                // check if nuke room still valid
                var flag = Game.flags[creep.room.name+" NUKE"]
                if (!flag) {
                    creep.say("missing target")
                }
                else {
                    roomNuker.launch(room, flag);
                }
                
                creep.suicide();
            }
        } else {
            creep.goTo(creep.room.terminal);
        }
    }
};