module.exports = {
    run(creep) {
        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        else if(!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }
        else {
            creep.memory.full = false;
        }

        // console.log(creep.memory.to)

        var allStructures = creep.pos.findInRange(FIND_MY_STRUCTURES, 1)
        structures = allStructures.filter(structure => structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
        if (structures.length == 0) structures = allStructures.filter(structure => structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 100);
        
        if (!creep.memory["full"]) {
            
            // if link has energy
            var link = allStructures.filter(structure => structure.structureType == STRUCTURE_LINK)[0];
            if (link) {
                var linkStore = _.last(_.keys(link.store))
                if (linkStore) {
                    creep.withdraw(link, linkStore);
                    return;
                }
            }
            
            if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 25000) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                return;
            }

            // if a spawn needs energy take from storage
            if ((structures.length > 0 || (creep.room.terminal && creep.room.terminal["store"][RESOURCE_ENERGY] < 10000))) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                return;
            }
            
            if (Object.keys(creep.room.storage.store).includes("energy") && creep.room.storage.store.Energy > 750000) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            }
        }
        else if (creep.memory["full"]) {
            // console.log(creep.name, target)
            if ( _.last(_.keys(creep.store)) == RESOURCE_ENERGY) {
                if (structures.length > 0) {
                    creep.transfer(structures[0], _.last(_.keys(creep.store)));
                    return;
                }
                else if ((creep.room.terminal && creep.room.terminal["store"][RESOURCE_ENERGY] < 10000 && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 10000) || (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 750000) || (!creep.room.storage && creep.room.terminal)) {
                    creep.say('test')
                    creep.transfer(creep.room.terminal, _.last(_.keys(creep.store)));
                    return;
                }
                else {
                    // check if storage full if so drop energy
                    if (creep.room.storage) {
                        creep.transfer(creep.room.storage, _.last(_.keys(creep.store)));
                        return;
                    }
                    else {
                        creep.say("no storage")
                    }
                }
            }
            else {
                creep.transfer(creep.room.terminal, _.last(_.keys(creep.store)));
            }
        }
    }
}