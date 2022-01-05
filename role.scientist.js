const roomCache = require('room.cache');

const BASES = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];

// reaction ingredients
const REACTIONS = {

    // Base compounds
    "OH": [RESOURCE_OXYGEN, RESOURCE_HYDROGEN],
    "ZK": [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM],
    "UL": [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM],
    "G": [RESOURCE_ZYNTHIUM_KEANITE, RESOURCE_UTRIUM_LEMERGITE],

    // Tier 1 compounds
    "UH": [RESOURCE_UTRIUM, RESOURCE_HYDROGEN],
    "UO": [RESOURCE_UTRIUM, RESOURCE_OXYGEN],
    "KH": [RESOURCE_KEANIUM, RESOURCE_HYDROGEN],
    "KO": [RESOURCE_KEANIUM, RESOURCE_OXYGEN],
    "LH": [RESOURCE_LEMERGIUM, RESOURCE_HYDROGEN],
    "LO": [RESOURCE_LEMERGIUM, RESOURCE_OXYGEN],
    "ZH": [RESOURCE_ZYNTHIUM, RESOURCE_HYDROGEN],
    "ZO": [RESOURCE_ZYNTHIUM, RESOURCE_OXYGEN],
    "GH": [RESOURCE_GHODIUM, RESOURCE_HYDROGEN],
    "GO": [RESOURCE_GHODIUM, RESOURCE_OXYGEN],

    // Tier 2 compounds
    "UH2O": [RESOURCE_UTRIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    "UHO2": [RESOURCE_UTRIUM_OXIDE, RESOURCE_HYDROXIDE],
    "KH2O": [RESOURCE_KEANIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    "KHO2": [RESOURCE_KEANIUM_OXIDE, RESOURCE_HYDROXIDE],
    "LH2O": [RESOURCE_LEMERGIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    "LHO2": [RESOURCE_LEMERGIUM_OXIDE, RESOURCE_HYDROXIDE],
    "ZH2O": [RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    "ZHO2": [RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_HYDROXIDE],
    "GH2O": [RESOURCE_GHODIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    "GHO2": [RESOURCE_GHODIUM_OXIDE, RESOURCE_HYDROXIDE],

    // Tier 3 compounds
    "XUH2O": [RESOURCE_UTRIUM_ACID, RESOURCE_CATALYST],
    "XUHO2": [RESOURCE_UTRIUM_ALKALIDE, RESOURCE_CATALYST],
    "XKH2O": [RESOURCE_KEANIUM_ACID, RESOURCE_CATALYST],
    "XKHO2": [RESOURCE_KEANIUM_ALKALIDE, RESOURCE_CATALYST],
    "XLH2O": [RESOURCE_LEMERGIUM_ACID, RESOURCE_CATALYST],
    "XLHO2": [RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_CATALYST],
    "XZH2O": [RESOURCE_ZYNTHIUM_ACID, RESOURCE_CATALYST],
    "XZHO2": [RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_CATALYST],
    "XGH2O": [RESOURCE_GHODIUM_ACID, RESOURCE_CATALYST],
    "XGHO2": [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_CATALYST]
}

const REACTION_AMOUNTS = {
    // Base compounds
    OH: 0,	    // intermediate
    ZK: 0,	    // intermediate
    UL: 0,	    // intermediate
    G: 5000, 	// intermediate & nukes

    // Tier 1 compounds
    UH: 0,	    // (+100 % attack)
    UO: 0,	    // (+200 % harvest)
    KH: 0,	    // (+50 % carry)
    KO: 0,	    // (+100 % ranged attack)
    LH: 0,	    // (+50 % build and repair)
    LO: 0,	    // (+100 % heal)
    ZH: 0,	    // (+100 % dismantle)
    ZO: 0,	    // (+100 % fatigue)
    GH: 0,	    // (+50 % upgrade)
    GO: 0,	    // (-30 % damage)

    // Tier 2 compounds
    UH2O: 0,	    // (+200 % attack)
    UHO2: 0,	    // (+400 % harvest)
    KH2O: 0,	    // (+100 carry)
    KHO2: 0,	    // (+200 % ranged attack)
    LH2O: 0,	    // (+80 % build and repair)
    LHO2: 0,	    // (+200 % heal)
    ZH2O: 0,	    // (+200 % dismantle)
    ZHO2: 0,	    // (+200% fatigue)
    GH2O: 0,	    // (+80 % upgrade)
    GHO2: 0,	    // (-50 % damage)

    // Tier 3 compounds
    XUH2O: 3000, 	// (+300 % attack)
    // XUHO2: 3000, 	// (+600 % harvest)
    // XKH2O: 3000, 	// (+150 carry)
    XKHO2: 3000, 	// (+300 % ranged attack)
    // XLH2O: 3000, 	// (+100 % build and repair)
    XLHO2: 3000, 	// (+300 % heal)
    XZH2O: 3000, 	// (+300 % dismantle)
    XZHO2: 3000, 	// (+300 % fatigue)
    // XGH2O: 3000,	// (+100 % upgrade)
    XGHO2: 3000, 	// (-70 % damage)

    // XUH2O: 0, 	// (+300 % attack)
    XUHO2: 0, 	// (+600 % harvest)
    XKH2O: 0, 	// (+150 carry)
    // XKHO2: 0, 	// (+300 % ranged attack)
    XLH2O: 0, 	// (+100 % build and repair)
    // XLHO2: 0, 	// (+300 % heal)
    // XZH2O: 0, 	// (+300 % dismantle)
    // XZHO2: 0, 	// (+300 % fatigue)
    XGH2O: 0,	// (+100 % upgrade)
    // XGHO2: 0, 	// (-70 % damage)
};

// console.log(Object.values(REACTION_AMOUNTS).reduce((a, b) => a + b, 0));
// console.log(Object.keys(REACTION_AMOUNTS).length*3000);

let primary;
let secondary;
let tertiary;

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

        if (creep.memory.full) {


            var to = Game.getObjectById(creep.memory.toID);
            if (!to) return;

            if (_.sum(creep.carry) > to.store.getFreeCapacity(creep.memory.resource)) {
                creep.memory.toID = creep.room.terminal.id;
            }
            if (creep.transfer(to, creep.memory.resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(to, { visualizePathStyle: { stroke: '#ff0000' } });
            }
        }
        else {

            if (creep.room.memory.reaction) {
                module.exports.createBoosts(creep)
            }
            else {
                creep.say('dead end')
            }


            if (creep.ticksToLive > 3 && creep.memory.fromID != null) {
                var from = Game.getObjectById(creep.memory.fromID);
                let withdraw = creep.withdraw(from, creep.memory.resource)
                if (withdraw == ERR_NOT_IN_RANGE) {
                    creep.moveTo(from, { visualizePathStyle: { stroke: '#ff0000' } });
                }
                else if (withdraw == ERR_NOT_ENOUGH_RESOURCES) {
                    module.exports.getReaction(creep.room, tertiary, creep);
                }
            }
        }
    },
    createBoosts(creep) {

        let allLabs = creep.room.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_LAB);
        let primary = allLabs.find(structure => structure.id == creep.room.memory.primaryLab);
        let secondary = allLabs.find(structure => structure.id == creep.room.memory.secondaryLab);
        let tertiary = allLabs.filter(structure => structure.id != creep.room.memory.primaryLab && structure.id != creep.room.memory.secondaryLab);
        tertiary = _.sortBy(allLabs, lab => lab.store[lab.mineralType]);

        if (allLabs.length < 3 || (!primary || !secondary || !tertiary)) {
            roomCache.labs(creep.room);
            creep.room.reaction = undefined;
            // creep.suicide()
        }

        creep.memory.fromID = null;
        creep.memory.toID = null;
        creep.memory.resource = null;



        if (secondary != undefined && secondary.store[secondary.mineralType] > 0 && (creep.room.memory.reaction == null || secondary.mineralType != creep.room.memory.reaction.partOne)) {
            creep.memory.fromID = secondary.id;
            creep.memory.toID = creep.room.terminal.id;
            creep.memory.resource = secondary.mineralType;

            creep.say('take alt');
            return;
        }

        if (primary != undefined && primary.store[primary.mineralType] > 0 && (creep.room.memory.reaction == null || primary.mineralType != creep.room.memory.reaction.partTwo)) {
            creep.memory.fromID = primary.id;
            creep.memory.toID = creep.room.terminal.id;
            creep.memory.resource = primary.mineralType;

            creep.say('take main');
            return;
        }



        if (creep.room.memory.reaction != null) {
            if (
                (primary != undefined && !primary.mineralType ||
                    (LAB_MINERAL_CAPACITY - primary.store[primary.mineralType] >= creep.memory.capacity) &&
                    creep.room.terminal.store[creep.room.memory.reaction.partTwo] >= creep.memory.capacity &&
                    (primary.store[primary.mineralType] == undefined || primary.store[primary.mineralType] < Math.min(200, creep.room.memory.reaction.amount)))) {
                // if ((!primary.mineralType || LAB_MINERAL_CAPACITY-primary.store[primary.mineralType] >= creep.memory.capacity) && creep.room.terminal.store[creep.room.memory.reaction.partTwo] > creep.memory.capacity && creep.room.memory.reaction != null && (primary.store[primary.mineralType] == undefined || primary.store[primary.mineralType] < creep.room.memory.reaction.amount)) {
                creep.say('add main');
                creep.memory.fromID = creep.room.terminal.id;
                creep.memory.toID = primary.id;
                creep.memory.resource = creep.room.memory.reaction.partTwo;
                return;
            }
            else if (creep.room.terminal.store[creep.room.memory.reaction.partTwo] < creep.memory.capacity) {
                module.exports.getReaction(creep.room, tertiary, creep);
            }

            // console.log((!secondary.mineralType || LAB_MINERAL_CAPACITY-secondary.store[secondary.mineralType] >= creep.memory.capacity) , creep.room.terminal.store[creep.room.memory.reaction.partOne] > creep.memory.capacity , creep.room.memory.reaction != null , (secondary.store[secondary.mineralType] == undefined || secondary.store[secondary.mineralType] < creep.room.memory.reaction.amount))
            // if ((!secondary.mineralType || LAB_MINERAL_CAPACITY-secondary.store[secondary.mineralType] >= creep.memory.capacity) && creep.room.terminal.store[creep.room.memory.reaction.partOne] > creep.memory.capacity && creep.room.memory.reaction != null && (secondary.store[secondary.mineralType] == undefined || secondary.store[secondary.mineralType] < creep.room.memory.reaction.amount)) {
            if (
                (!secondary.mineralType || 
                    (LAB_MINERAL_CAPACITY - secondary.store[secondary.mineralType] >= creep.memory.capacity) && 
                    creep.room.terminal.store[creep.room.memory.reaction.partOne] >= 200 && 
                    (secondary.store[secondary.mineralType] == undefined || secondary.store[secondary.mineralType] < 200))) {
                creep.say('add alt');
                creep.memory.fromID = creep.room.terminal.id;
                creep.memory.toID = secondary.id;
                creep.memory.resource = creep.room.memory.reaction.partOne;
                return;
            }
            else if (creep.room.terminal.store[creep.room.memory.reaction.partOne] == 0 || creep.room.terminal.store[creep.room.memory.reaction.partTwo] == 0) {
                module.exports.getReaction(creep.room, tertiary, creep);
            }
        }

        for (lab of tertiary) {
            if (!lab || lab == primary || lab == secondary) continue;
            module.exports.react(lab, primary, secondary, creep);

            if (lab.store[lab.mineralType] >= creep.carryCapacity || (lab.mineralType != undefined && (creep.room.memory.reaction == null || lab.mineralType != creep.room.memory.reaction.type))) {
                creep.memory.fromID = lab.id;
                creep.memory.toID = creep.room.terminal.id;
                creep.memory.resource = lab.mineralType;
                creep.say("take from lab")
                return;
            }
        }


    },

    currentAmount(resource, room, tertiary, creep = undefined) {
        let terminalAmount = (room.terminal && room.terminal.store[resource]) || 0;
        let labAmount = _.sum(_.filter(tertiary, (l) => l != null && l.mineralType == resource), (l) => l.mineralAmount);
        if (!creep) return terminalAmount + labAmount;

        let creepAmount = (Object.keys(creep.carry).includes(resource)) ? creep.carry[resource] : 0;
        return terminalAmount + labAmount + creepAmount;
    },

    // make creep optional
    // currentAmount(resource, creep) {
    //     // let storageAmount = creep.room.storage.store[resource] || 0;
    //     let terminalAmount = (creep.room.terminal && creep.room.terminal.store[resource]) || 0;
    //     let labAmount = _.sum(_.filter(tertiary, (l) => l != null && l.mineralType == resource), (l) => l.mineralAmount);
    //     let creepAmount = (Object.keys(creep.carry).includes(resource)) ? creep.carry[resource] : 0;
    //     return terminalAmount + labAmount + creepAmount;
    // },
    getResources(amount, amounts, element, creep) {

        var copyOfAmounts = amounts;
        if (!BASES.includes(element)) {
            if (Object.keys(REACTIONS).includes(element)) {
                copyOfAmounts = module.exports.getResources(amount, copyOfAmounts, REACTIONS[element][0], creep);

                if (!BASES.includes(REACTIONS[element][0])) {
                    copyOfAmounts[REACTIONS[element][0]] = copyOfAmounts[REACTIONS[element][0]] + amount;
                }

                copyOfAmounts = module.exports.getResources(amount, copyOfAmounts, REACTIONS[element][1], creep);

                if (!BASES.includes(REACTIONS[element][1])) {
                    copyOfAmounts[REACTIONS[element][1]] = copyOfAmounts[REACTIONS[element][1]] + amount;
                }
            }
        }
        return (copyOfAmounts)
    },

    // change function to use room instead of creep
    getReaction(room, labs, creep = undefined) {
        var amounts = {};
        var currentReaction;

        // find better way to do
        Object.keys(REACTIONS).forEach(key => {
            amounts[key] = 0;
        });

        if (!room.terminal) return null;
        // console.log(JSON.stringify(amounts));

        for (reaction of Object.keys(REACTIONS).reverse()) {
        // Object.keys(REACTIONS).reverse().forEach(reaction => {

            if (creep) var amountToCreate = REACTION_AMOUNTS[reaction] - module.exports.currentAmount(reaction, room, labs, creep);
            else var amountToCreate = REACTION_AMOUNTS[reaction] - module.exports.currentAmount(reaction, room, labs);

            // add just the reaction amount
            amounts[reaction] = amounts[reaction] + amountToCreate;

            // add all ingridents needed for the reaction recursively
            amounts = module.exports.getResources(amountToCreate, amounts, reaction, creep);

            // console.log(JSON.stringify(amounts))
            // console.log(REACTIONS[reaction][1])
            // console.log(amounts[reaction] > 0 , Object.keys(creep.room.terminal.store).includes(REACTIONS[reaction][0]) , Object.keys(creep.room.terminal.store).includes(REACTIONS[reaction][1]) , creep.room.terminal.store[REACTIONS[reaction][0]] > 500 , creep.room.terminal.store[REACTIONS[reaction][1]] > 500)

            // console.log(reaction, amounts[reaction], amounts[reaction] > 0 , module.exports.currentAmount(REACTIONS[reaction][0], room, labs, creep) > Math.min(200, amounts[reaction]) , module.exports.currentAmount([REACTIONS[reaction][1]], room, labs, creep) > Math.min(200, amounts[reaction]))
            if (amounts[reaction] > 0 && module.exports.currentAmount(REACTIONS[reaction][0], room, labs, creep) > Math.min(200, amounts[reaction])  && module.exports.currentAmount([REACTIONS[reaction][1]], room, labs, creep) > Math.min(200, amounts[reaction])) {
                if (creep) console.log(creep.name + ": " + reaction + ": " + amountToCreate,":",amounts[reaction]);
                if (!currentReaction) currentReaction = reaction;
                // return currentReaction;
                // console.log(currentReaction)
                // console.log(JSON.stringify(currentReaction))
            }
        }
        // });
        // console.log(JSON.stringify(amounts))

        // console.log("currrent",currentReaction)
        if (currentReaction) room.memory.reaction = { "type": currentReaction, "amount": Math.min(amounts[currentReaction], 500), "partOne": REACTIONS[currentReaction][0], "partTwo": REACTIONS[currentReaction][1] }
        else room.memory.reaction = null;
        return currentReaction;
    },

    react(lab, primary, secondary, creep) {
        if (lab && lab.cooldown == 0 && secondary && primary) {
            if (lab.runReaction(primary, secondary) == OK) {
                if (creep.room.memory.reaction) creep.room.memory.reaction.amount = creep.room.memory.reaction.amount - LAB_REACTION_AMOUNT;
            }

            // creep.room.memory.reaction.amount
        }
    },
}