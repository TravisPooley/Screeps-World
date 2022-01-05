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

module.exports = {
    run(creep) {

        if (creep.memory.capacity == null) {
            creep.memory.capacity = creep.store.getCapacity()
        }

        if (creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }

        if (!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }

        if (creep.memory["full"] == null) {
            creep.memory.full = false;
        }

        if (!creep.room.memory.reaction || creep.room.memory.reaction.amount <= 0) {
            module.exports.getReaction(creep.room, tertiary, creep);
        }

        if (creep.room.memory.reaction) {
            creep.say(creep.room.memory.reaction.type + " " + creep.room.memory.reaction.amount);
        }
        else {
            creep.say("no reaction")
            creep.suicide();
        }

        if (creep.memory.resource == null) this.distributeBoosts();

        if (creep.memory.full) {
            if (creep.memory.toID != null) {
                var to = Game.getObjectById(creep.memory.toID);
                if (creep.transfer(to, creep.memory.resource, creep.memory.amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(to);
                }
            }
        }
        else {
            if (creep.ticksToLive > 3 && creep.memory.fromID != null) {
                var from = Game.getObjectById(creep.memory.fromID);
                if (creep.withdraw(from, creep.memory.resource, creep.memory.amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(from, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        }
    },

    distributeBoosts() {
        var flag = Game.flags[creep.room.name];

        if (!flag) {
            creep.say('no flag')
            return
        }

        var allLabs = creep.room.find(FIND_MY_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_LAB});
    
        const boostStoreAmount = 3000;
    
        var labs = [
            {"resource": RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,  "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y-2))},
            {"resource": RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 2) && structure.pos.y == (flag.pos.y-3))},
            {"resource": RESOURCE_CATALYZED_UTRIUM_ACID,        "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y-4))},
            {"resource": RESOURCE_CATALYZED_UTRIUM_ALKALIDE,    "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 5) && structure.pos.y == (flag.pos.y-4))},
            {"resource": RESOURCE_CATALYZED_KEANIUM_ACID,       "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 5) && structure.pos.y == (flag.pos.y-3))},
            {"resource": RESOURCE_CATALYZED_KEANIUM_ALKALIDE,   "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 2) && structure.pos.y == (flag.pos.y-4))},
            {"resource": RESOURCE_CATALYZED_LEMERGIUM_ACID,     "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y-5))},
            {"resource": RESOURCE_CATALYZED_ZYNTHIUM_ACID,      "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y-3))},
            {"resource": RESOURCE_CATALYZED_GHODIUM_ACID,       "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y-5))},
            {"resource": RESOURCE_CATALYZED_GHODIUM_ALKALIDE,   "lab": allLabs.find(structure => structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y-2))}
        ];
        
        creep.memory.fromID = null;
        creep.memory.toID = null;
        creep.memory.resource = null;
    
        for (i in labs) {
    
            if (labs[i]["lab"] && labs[i]["lab"].mineralType && labs[i]["lab"].mineralType != labs[i]["resource"]) {
                creep.memory.fromID = labs[i]["lab"].id;
                creep.memory.toID = creep.room.terminal.id;
                creep.memory.resource = labs[i]["lab"].mineralType;
                creep.memory.amount = Math.min(labs[i]["lab"].store[labs[i]["lab"].mineralType], creep.memory.capacity);
                creep.say("take "+labs[i]["lab"].mineralType);
                break;
            }
            else if (labs[i]["lab"] && labs[i]["lab"].store[labs[i]["resource"]] < boostStoreAmount && creep.room.terminal.store[labs[i]["resource"]] > 0) {
                creep.memory.fromID = creep.room.terminal.id;
                creep.memory.toID = labs[i]["lab"].id;
                creep.memory.resource = labs[i]["resource"];
                creep.memory.amount = Math.min(creep.memory.capacity, boostStoreAmount-labs[i]["lab"].store[labs[i]["resource"]]);
                creep.say("add "+labs[i]["resource"]);
                break;
            }
        }
    },
}
