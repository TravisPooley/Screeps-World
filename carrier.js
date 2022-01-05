const REACTIONS = {

    // Base compounds
    "UL": [RESOURCE_UTRIUM , RESOURCE_LEMERGIUM], 
    "ZK": [RESOURCE_ZYNTHIUM , RESOURCE_KEANIUM],
    "G": [RESOURCE_ZYNTHIUM_KEANITE , RESOURCE_UTRIUM_LEMERGITE],
    "OH": [RESOURCE_OXYGEN , RESOURCE_HYDROGEN],

    // Tier 1 compounds
    "UH": [RESOURCE_UTRIUM , RESOURCE_HYDROGEN],
    "KH": [RESOURCE_KEANIUM , RESOURCE_HYDROGEN],
    "GH": [RESOURCE_GHODIUM , RESOURCE_HYDROGEN],
    "LH": [RESOURCE_LEMERGIUM , RESOURCE_HYDROGEN],
    "ZH": [RESOURCE_ZYNTHIUM , RESOURCE_HYDROGEN],
    "KO": [RESOURCE_KEANIUM , RESOURCE_OXYGEN],
    "LO": [RESOURCE_LEMERGIUM , RESOURCE_OXYGEN],
    "ZO": [RESOURCE_ZYNTHIUM , RESOURCE_OXYGEN],
    "UO": [RESOURCE_UTRIUM , RESOURCE_OXYGEN],
    "GO": [RESOURCE_GHODIUM , RESOURCE_OXYGEN],

    // Tier 2 compounds
    "UH2O": [RESOURCE_UTRIUM_HYDRIDE , RESOURCE_HYDROXIDE],
    "UHO2": [RESOURCE_UTRIUM_OXIDE , RESOURCE_HYDROXIDE],
    "KH2O": [RESOURCE_KEANIUM_HYDRIDE , RESOURCE_HYDROXIDE],
    "KHO2": [RESOURCE_KEANIUM_OXIDE , RESOURCE_HYDROXIDE],
    "LH2O": [RESOURCE_LEMERGIUM_HYDRIDE , RESOURCE_HYDROXIDE],
    "LHO2": [RESOURCE_LEMERGIUM_OXIDE , RESOURCE_HYDROXIDE],
    "ZH2O": [RESOURCE_ZYNTHIUM_HYDRIDE , RESOURCE_HYDROXIDE],
    "ZHO2": [RESOURCE_ZYNTHIUM_OXIDE , RESOURCE_HYDROXIDE],
    "GH2O": [RESOURCE_GHODIUM_HYDRIDE , RESOURCE_HYDROXIDE],
    "GHO2": [RESOURCE_GHODIUM_OXIDE , RESOURCE_HYDROXIDE],

    // Tier 3 compounds
    "XZHO2": [RESOURCE_ZYNTHIUM_ALKALIDE , RESOURCE_CATALYST],
    "XGH2O": [RESOURCE_GHODIUM_ACID , RESOURCE_CATALYST],
    "XUH2O": [RESOURCE_UTRIUM_ACID , RESOURCE_CATALYST],
    "XUHO2": [RESOURCE_UTRIUM_ALKALIDE , RESOURCE_CATALYST],
    "XKH2O": [RESOURCE_KEANIUM_ACID , RESOURCE_CATALYST],
    "XKHO2": [RESOURCE_KEANIUM_ALKALIDE , RESOURCE_CATALYST],
    "XLH2O": [RESOURCE_LEMERGIUM_ACID , RESOURCE_CATALYST],
    "XLHO2": [RESOURCE_LEMERGIUM_ALKALIDE , RESOURCE_CATALYST],
    "XZH2O": [RESOURCE_ZYNTHIUM_ACID , RESOURCE_CATALYST],
    "XGHO2": [RESOURCE_GHODIUM_ALKALIDE , RESOURCE_CATALYST ]
}

const BASES = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];

const MINAMOUNT = 1250;
    
function currentAmount(resource, creep) {
    // let storageAmount = creep.room.storage.store[resource] || 0;
    let terminalAmount = (creep.room.terminal && creep.room.terminal.store[resource]) || 0;
    let labAmount = _.sum(_.filter(labs, (l) => l != null && l.mineralType == resource), (l) => l.mineralAmount);
    let creepAmount = (Object.keys(creep.carry).includes(resource)) ? creep.carry[resource] : 0;
    return terminalAmount + labAmount + creepAmount;
}

function getResources(amount, amounts, element, creep) {
    
    var copyOfAmounts = amounts;
    if (!BASES.includes(element)) {
        if (Object.keys(REACTIONS).includes(element)) {
            copyOfAmounts = getResources(amount, copyOfAmounts,  REACTIONS[element][0], creep);
            
            if (!BASES.includes(REACTIONS[element][0])) {
                copyOfAmounts[REACTIONS[element][0]] = copyOfAmounts[REACTIONS[element][0]] + amount;
            }

            copyOfAmounts = getResources(amount, copyOfAmounts, REACTIONS[element][1], creep);

            if (!BASES.includes(REACTIONS[element][1])) {
                copyOfAmounts[REACTIONS[element][1]] = copyOfAmounts[REACTIONS[element][1]] + amount;
            }
        }
    }
    return(copyOfAmounts)
}

function getReaction(creep, labs) {
    var amounts = {};
    var currentReaction;

    // find better way to do
    Object.keys(REACTIONS).forEach(key => {
        amounts[key] = 0;
    });
    
    Object.keys(REACTIONS).reverse().forEach(reaction => {
        var amountToCreate = MINAMOUNT - currentAmount(reaction, creep, labs);
        
        // add just the reaction amount
        amounts[reaction] = amounts[reaction] + amountToCreate;

        // add all ingridents needed for the reaction recursively
        amounts = getResources(amountToCreate, amounts, reaction, creep);
        
        if (amounts[reaction] > 0 && Object.keys(creep.room.terminal.store).includes(REACTIONS[reaction][0]) && Object.keys(creep.room.terminal.store).includes(REACTIONS[reaction][1]) && creep.room.terminal.store[REACTIONS[reaction][0]] > 500 && creep.room.terminal.store[REACTIONS[reaction][1]] > 500) {
            currentReaction = reaction;
        }
        
    });
    
    creep.room.memory.reaction = {"type":currentReaction,"amount":amounts[currentReaction], "partOne": REACTIONS[currentReaction][0], "partTwo": REACTIONS[currentReaction][1]}
    
}


function react() {
    if (reactionLab2 && reactionLab2.cooldown == 0 && reactionLab1 && mainLab) {
        reactionLab2.runReaction(mainLab, reactionLab1);
    }
    if (attackLab && attackLab.cooldown == 0 && reactionLab1 && mainLab) {
        attackLab.runReaction(mainLab, reactionLab1);
    }
    if (upgradeLab && upgradeLab.cooldown == 0 && reactionLab1 && mainLab) {
        upgradeLab.runReaction(mainLab, reactionLab1);
    }
    if (movementLab && movementLab.cooldown == 0 && reactionLab1 && mainLab) {
        movementLab.runReaction(mainLab, reactionLab1);
    }
    if (toughLab && toughLab.cooldown == 0 && reactionLab1 && mainLab) {
        toughLab.runReaction(mainLab, reactionLab1);
    }
    if (healLab && healLab.cooldown == 0 && reactionLab1 && mainLab) {
        healLab.runReaction(mainLab, reactionLab1);
    }
    if (rangedLab && rangedLab.cooldown == 0 && reactionLab1 && mainLab) {
        rangedLab.runReaction(mainLab, reactionLab1);
    }
    if (dismentalLab && dismentalLab.cooldown == 0 && reactionLab1 && mainLab) {
        dismentalLab.runReaction(mainLab, reactionLab1);
    }
}

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        
        creep.say(creep.room.memory.reaction.type+" "+creep.room.memory.reaction.amount);
        
        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }
        // if(!creep.memory["full"] && creep.carryCapacity == _.sum(creep.carry)) {
        //     creep.memory.full = true;
        // }

        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }
         
        
	    if(creep.memory.full) {
            // console.log(creep.name, "to", creep.memory.toID)
            var to = Game.getObjectById(creep.memory.toID);
            if(creep.transfer(to, creep.memory.resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(to, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
        // middle right
        reactionLab1 = Game.getObjectById(creep.room.memory.labs[0]);
        
        // bottom right
        reactionLab2 = Game.getObjectById(creep.room.memory.labs[2]);
        
        // middle left
        mainLab = Game.getObjectById(creep.room.memory.labs[1]);
        mainLabStoring = Object.keys(mainLab.store)[1];
        
        // bottom left
        toughLab = Game.getObjectById(creep.room.memory.labs[6]);
        // right top
        movementLab = Game.getObjectById(creep.room.memory.labs[5]);
        // left 
        healLab = Game.getObjectById(creep.room.memory.labs[7]);
        rangedLab = Game.getObjectById(creep.room.memory.labs[8]);
        dismentalLab = Game.getObjectById(creep.room.memory.labs[9]);
        attackLab = Game.getObjectById(creep.room.memory.labs[3]);
        upgradeLab = Game.getObjectById(creep.room.memory.labs[4]);
        labs = [reactionLab2, toughLab, movementLab, healLab, rangedLab, dismentalLab, attackLab, upgradeLab]
        react();

        
        if (Game.time % 10 == 0) {
            getReaction(creep, labs)
        }

        constructionLab = reactionLab1;
        carryLab = reactionLab2;
        harvestLab = mainLab;

        
        // console.log(creep.memory.fromID,
        //     creep.memory.toID,
        //     creep.memory.resource)

        if (!mainLab.mineralType || mainLab.store[mainLab.mineralType] < (250-_.sum(creep.carry)) && creep.room.terminal.store[creep.room.memory.reaction.partTwo]  && creep.room.memory.reaction != null && mainLab.store[mainLab.mineralType] < creep.room.memory.reaction.amount) {
            creep.memory.fromID = creep.room.terminal.id;
            creep.memory.toID = mainLab.id;
            creep.memory.resource = creep.room.memory.reaction.partTwo
            // console.log('add',creep.room.memory.reaction.partTwo,"to", lab,"left labs")
        }


        if (!reactionLab1.mineralType || reactionLab1.store[reactionLab1.mineralType] < (250-_.sum(creep.carry)) && creep.room.terminal.store[creep.room.memory.reaction.partOne] && creep.room.memory.reaction != null && reactionLab1.store[reactionLab1.mineralType] < creep.room.memory.reaction.amount) {
            creep.memory.fromID = creep.room.terminal.id;
            creep.memory.toID = reactionLab1.id;
            creep.memory.resource = creep.room.memory.reaction.partOne
            // console.log('add',creep.room.memory.reaction.partTwo,"to", lab,"right labs")
        }



        if (reactionLab1.mineralType && creep.room.memory.reaction != null && reactionLab1.mineralType != creep.room.memory.reaction.partOne) {
            creep.memory.fromID = reactionLab1.id;
            creep.memory.toID = creep.room.terminal.id;
            creep.memory.resource = reactionLab1.mineralType;
        }
        
        if (mainLab.mineralType && creep.room.memory.reaction != null && mainLab.mineralType != creep.room.memory.reaction.partTwo) {
            creep.memory.fromID = mainLab.id;
            creep.memory.toID = creep.room.terminal.id;
            creep.memory.resource = mainLab.mineralType;
            // console.log("incorrect stuff in ", lab)
        }

        var outputs = [rangedLab, dismentalLab, upgradeLab, movementLab, healLab, reactionLab2, toughLab, attackLab]
        outputs.forEach(lab => {
            if (lab && (lab.store[lab.mineralType] >= creep.carryCapacity || (lab.mineralType != undefined && lab.mineralType != creep.room.memory.reaction.type))) {
                creep.memory.fromID = lab.id;
                creep.memory.toID = creep.room.terminal.id;
                creep.memory.resource = lab.mineralType;
            }
        });

        // var rightLabs = [rangedLab, dismentalLab, upgradeLab, movementLab]
        // rightLabs.forEach(lab => {
        //     if (lab.mineralType && creep.room.memory.reaction != null && lab.mineralType != creep.room.memory.reaction.partOne) {
        //         creep.memory.fromID = reactionLab1.id;
        //         creep.memory.toID = creep.room.terminal.id;
        //         creep.memory.resource = reactionLab1.mineralType;
        //         // console.log("incorrect stuff in ",lab,"right labs")
        //     }
        //     else if (!lab.mineralType || lab.store[lab.mineralType] < (500-_.sum(creep.carry)) && creep.room.memory.reaction != null && lab.store[lab.mineralType] < creep.room.memory.reaction.amount) {
        //         creep.memory.fromID = creep.room.terminal.id;
        //         creep.memory.toID = lab.id;
        //         creep.memory.resource = creep.room.memory.reaction.partOne
        //         // console.log('add',creep.room.memory.reaction.partTwo,"to", lab,"right labs")
        //     }
        // });

        // var leftLabs = [healLab, reactionLab2, toughLab, attackLab]
        // leftLabs.forEach(lab => {
        //     if (lab.mineralType && creep.room.memory.reaction != null && lab.mineralType != creep.room.memory.reaction.partTwo) {
        //         creep.memory.fromID = reactionLab1.id;
        //         creep.memory.toID = creep.room.terminal.id;
        //         creep.memory.resource = reactionLab1.mineralType;
        //         // console.log("incorrect stuff in ", lab)
        //     }
        //     else if (!lab.mineralType || lab.store[lab.mineralType] < (500-_.sum(creep.carry)) && creep.room.memory.reaction != null && lab.store[lab.mineralType] < creep.room.memory.reaction.amount) {
        //         creep.memory.fromID = creep.room.terminal.id;
        //         creep.memory.toID = lab.id;
        //         creep.memory.resource = creep.room.memory.reaction.partTwo
        //         // console.log('add',creep.room.memory.reaction.partTwo,"to", lab,"left labs")
        //     }
            
        // });



        
        // [healLab, reactionLab2, toughLab, attackLab].forEach(lab => {
        //     if (lab.mineralType && creep.room.memory.reaction != null && lab.mineralType != creep.room.memory.reaction.partTwo) {
        //         // creep.memory.fromID = reactionLab1.id;
        //         // creep.memory.toID = creep.room.terminal.id;
        //         // creep.memory.resource = reactionLab1.mineralType;
        //         console.log(lab)
        //     }
        // });


        // if the product lab has enough of the element to fill the carrier withdraw it
        // if (mainLab && mainLabStoring && mainLab.store[mainLabStoring] >= creep.carryCapacity) {
        //     creep.memory.fromID = mainLab.id
        //     creep.memory.toID = creep.room.terminal.id;
        //     creep.memory.resource = mainLabStoring;
        // }
        // else if (mainLab && mainLabStoring && creep.room.memory.reaction != null && mainLabStoring != creep.room.memory.reaction.type) {
        //     creep.memory.fromID = mainLab.id
        //     creep.memory.toID = creep.room.terminal.id;
        //     creep.memory.resource = mainLabStoring;
        // }
        // else if (reactionLab1.mineralType && creep.room.memory.reaction != null && reactionLab1.mineralType != creep.room.memory.reaction.partOne) {
        //     creep.memory.fromID = reactionLab1.id;
        //     creep.memory.toID = creep.room.terminal.id;
        //     creep.memory.resource = reactionLab1.mineralType;
        // }
        // else if (reactionLab2.mineralType && creep.room.memory.reaction != null && reactionLab2.mineralType != creep.room.memory.reaction.partTwo) {
        //     creep.memory.fromID = reactionLab2.id;
        //     creep.memory.toID = creep.room.terminal.id;
        //     creep.memory.resource = reactionLab2.mineralType;
        // }
        // else if (!reactionLab1.mineralType || reactionLab1.store[reactionLab1.mineralType] < (3000-_.sum(creep.carry)) && creep.room.memory.reaction != null && reactionLab1.store[reactionLab1.mineralType] < creep.room.memory.reaction.amount && reactionLab1.store[reactionLab1.mineralType] < reactionLab2.store[reactionLab2.mineralType]) {
        //     creep.memory.fromID = creep.room.terminal.id;
        //     creep.memory.toID = reactionLab1.id;
        //     creep.memory.resource = creep.room.memory.reaction.partOne
        // }
        // else if (!reactionLab2.mineralType || reactionLab2.store[reactionLab2.mineralType] < (3000-_.sum(creep.carry)) && creep.room.memory.reaction != null && reactionLab2.store[reactionLab2.mineralType] < creep.room.memory.reaction.amount) {
        //     creep.memory.fromID = creep.room.terminal.id;
        //     creep.memory.toID = reactionLab2.id;
        //     creep.memory.resource = creep.room.memory.reaction.partTwo
        // }
        // else if (mainLab && mainLabStoring && mainLab.store[mainLabStoring] >= 1) {
        //     creep.memory.fromID = mainLab.id
        //     creep.memory.toID = creep.room.terminal.id;
        //     creep.memory.resource = mainLabStoring;
        // }
        // else if (movementLab != null && creep.room.terminal && movementLab.store[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] <= (3000-_.sum(creep.carry)) && Object.keys(creep.room.terminal.store).includes(RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE)) {
        //     creep.memory.fromID = creep.room.terminal.id;
        //     creep.memory.toID = movementLab.id;
        //     creep.memory.resource = RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE;
        // }
        // else if (upgradeLab != null && creep.room.terminal && upgradeLab.store[RESOURCE_CATALYZED_GHODIUM_ACID] <= (3000-_.sum(creep.carry)) && Object.keys(creep.room.terminal.store).includes(RESOURCE_CATALYZED_GHODIUM_ACID)) {
        //     creep.memory.fromID = creep.room.terminal.id;
        //     creep.memory.toID = upgradeLab.id;
        //     creep.memory.resource = RESOURCE_CATALYZED_GHODIUM_ACID;
        // }
        // else if (attackLab != null && creep.room.terminal && upgradeLab.store[RESOURCE_CATALYZED_UTRIUM_ACID] <= (3000-_.sum(creep.carry)) && Object.keys(creep.room.terminal.store).includes(RESOURCE_CATALYZED_UTRIUM_ACID)) {
        //     creep.memory.fromID = creep.room.terminal.id;
        //     creep.memory.toID = attackLab.id;
        //     creep.memory.resource = RESOURCE_CATALYZED_UTRIUM_ACID;
        // }
        // else {
        //     creep.memory.fromID = null;
        //     creep.memory.toID = null;
        //     creep.memory.resource = null;
        //     creep.say("waiting")
        // }
        
        // var [a,b,c,d] = [0,1,2,3]
        
        // if (reactionLab1 && reactionLab2 && reactionLab1.store[reactionLab1Storing].amount != reactionLab2.store[reactionLab2Storing].amount) {
        //     creep.memory.fromID = creep.room.terminal.id;
        //     if (reactionLab1.store[reactionLab1Storing].amount > reactionLab2.store[reactionLab2Storing].amount) {
        //         creep.memory.toID = reactionLab2.id;
        //     }
        //     else {
        //         creep.memory.toID = reactionLab1.id;
        //     }
        // }
        
        // if ()
        // creep.memory.toID = creep.room.terminal.id;
           
            
            var from = Game.getObjectById(creep.memory.fromID);
            if(creep.withdraw(from, creep.memory.resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(from, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

// Game.spawns['Spawn1'].spawnCreep([CARRY, MOVE], "Carrier", { memory: { role: 'carrier', toID: "6048e4d9dc2f3321066f9ba6", fromID: "6048d4893df0b0126525bd96", resource: RESOURCE_UTRIUM_LEMERGITE } });
// Game.spawns['Spawn1'].spawnCreep([CARRY, MOVE], "Carrier", { memory: { role: 'carrier', toID: "6048fdcfdc2f337ca86fa3e2", fromID: "6048d4893df0b0126525bd96", resource: RESOURCE_ZYNTHIUM_KEANITE } });
// Game.spawns['Spawn1'].spawnCreep([CARRY, MOVE], "Carrier", { memory: { role: 'carrier', toID: "604026a0dc2f33ce176c9fea", fromID: "604915952fba4f3aa89318dc", resource: RESOURCE_GHODIUM } });


// Game.spawns['Spawn1'].spawnCreep([CARRY, MOVE], "CarrierI", { memory: { role: 'carrier', toID: "6048e4d9dc2f3321066f9ba6", fromID: "6048d4893df0b0126525bd96", resource: RESOURCE_UTRIUM } });
// Game.spawns['Spawn1'].spawnCreep([CARRY, MOVE], "CarrierII", { memory: { role: 'carrier', toID: "6048fdcfdc2f337ca86fa3e2", fromID: "6048d4893df0b0126525bd96", resource: RESOURCE_LEMERGIUM } });
// Game.spawns['Spawn1'].spawnCreep([CARRY, MOVE], "Carrier", { memory: { role: 'carrier', toID: "604026a0dc2f33ce176c9fea", fromID: "604915952fba4f3aa89318dc", resource: RESOURCE_UTRIUM_LEMERGITE } });




// Game.spawns['Spawn3'].spawnCreep([CARRY, MOVE], "CarrierI", { memory: { role: 'carrier', toID: "605a61285e99e4f6d0b25917", fromID: "6058b6aac3e8ea5f47705240", resource: RESOURCE_UTRIUM } });
// Game.spawns['Spawn3'].spawnCreep([CARRY, MOVE], "CarrierII", { memory: { role: 'carrier', toID: "6059648f31a489459a9db3d9", fromID: "6058b6aac3e8ea5f47705240", resource: RESOURCE_LEMERGIUM } });
// Game.spawns['Spawn3'].spawnCreep([CARRY, MOVE], "Carrieer", { memory: { role: 'carrier', toID: "6058b6aac3e8ea5f47705240", fromID: "605c567b5ce9e578e4a879b4", resource: RESOURCE_UTRIUM_LEMERGITE } });

// Game.spawns['Spawn3'].spawnCreep([CARRY, MOVE], "Carrier-1", { memory: { role: 'carrier', toID: "605a61285e99e4f6d0b25917", fromID: "6058b6aac3e8ea5f47705240", resource: RESOURCE_UTRIUM_LEMERGITE } });
// Game.spawns['Spawn3'].spawnCreep([CARRY, MOVE], "Carrier-2", { memory: { role: 'carrier', toID: "6059648f31a489459a9db3d9", fromID: "6058b6aac3e8ea5f47705240", resource: RESOURCE_ZYNTHIUM_KEANITE } });
// Game.spawns['Spawn3'].spawnCreep([CARRY, MOVE], "Carrier-3", { memory: { role: 'carrier', toID: "6058b6aac3e8ea5f47705240", fromID: "605c567b5ce9e578e4a879b4", resource: RESOURCE_GHODIUM } });
module.exports = roleCarrier;