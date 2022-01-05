const boostTypes = {
    "attack": RESOURCE_CATALYZED_UTRIUM_ACID,
    "harvest": RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
    "carry": RESOURCE_CATALYZED_KEANIUM_ACID,
    "ranged": RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
    "construction": RESOURCE_CATALYZED_LEMERGIUM_ACID,
    "heal": RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
    "dismantle": RESOURCE_CATALYZED_ZYNTHIUM_ACID,
    "move": RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
    "upgrade": RESOURCE_CATALYZED_GHODIUM_ACID,
    "tough": RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
}

const boostParts = {
    "attack": ATTACK,
    "harvest": WORK,
    "carry": CARRY,
    "ranged": RANGED_ATTACK,
    "construction": WORK,
    "heal": HEAL,
    "dismantle": WORK,
    "move": MOVE,
    "upgrade": WORK,
    "tough": TOUGH,
}

module.exports = {
    tryBoost(creep) {
        for (boost in creep.memory.boosts) {
            if (boost == "tough" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "move" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "heal" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "ranged" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "dismantle" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "attack" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "harvest" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "carry" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "upgrade" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
            else if (boost == "construction" && module.exports.check(creep, boost)) {
                creep.memory.boosts = _.omit(creep.memory.boosts,boost);
            }
        }
        
        if (Object.keys(creep.memory.boosts).length == 0) {
            creep.memory = _.omit(creep.memory,"boosts");
        }
        
    },
    tryUnboost(creep) {
    },
    check(creep, boost) {

        // console.log(creep, boost)
        // console.log(boostTypes[boost])
        // console.log(boost)
        // console.log(lab != null , lab.store[boostTypes[boost]] > 100 , _.find(creep.body, (p) => p.type === boostParts[boost]) != undefined , _.find(creep.body, (p) => p.type === boostParts[boost] && !Object.keys(p).includes("boost")) != undefined )
        let lab = creep.room.find(FIND_MY_STRUCTURES).find(structure => structure.structureType == STRUCTURE_LAB && Object.keys(structure.store).includes(boostTypes[boost]));

        // console.log(lab != null && lab.store[boostTypes[boost]] > 100 && _.find(creep.body, (p) => p.type === boostParts[boost]) != undefined && _.find(creep.body, (p) => p.type === boostParts[boost] && !Object.keys(p).includes("boost")) != undefined )

        // return false;
        if (lab != null && lab.store[boostTypes[boost]] > 100 && _.find(creep.body, (p) => p.type === boostParts[boost]) != undefined && _.find(creep.body, (p) => p.type === boostParts[boost] && !Object.keys(p).includes("boost")) != undefined ) {
            module.exports.boost(creep, lab);
        }
        else {
            return(true);
        }
    },
    boost(creep, lab) {
        if(creep.pos.isNearTo(lab)) {
            lab.boostCreep(creep);
        } else {
            creep.moveTo(lab);
        }
    }
};
