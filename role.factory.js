
const factoryRequirements = {
    'energy': 8000,
    'battery': 2000,
    "H": 2000,
    "O": 2000,
    "U": 2000,
    "L": 2000,
    "Z": 2000,
    "X": 2000,
    "G": 2000,
    'utrium_bar': 800,
    'lemergium_bar': 800,
    'zynthium_bar': 800,
    'keanium_bar': 800,
    'ghodium_melt': 800,
    'oxidant': 800,
    'reductant': 800,
    'purifier': 800,
    'composite': 800,
    'crystal': 800,
    'liquid': 800,
    'wire': 1000,
    'cell': 1000,
    'alloy': 1000,
    'condensate': 1000,
    "silicon": 1000,
    "metal": 1000,
    "mist": 1000,
    "biomass": 1000,
    'switch': 50,
    'transistor': 30,
    'microchip': 10,
    'circuit': 10,
    'phlegm': 30,
    'tissue': 30,
    'muscle': 10,
    'organoid': 5,
    'tube': 30,
    'fixtures': 30,
    'frame': 10,
    'hydraulics': 10,
    'concentrate': 50,
    'extract': 30,
    'spirit': 20,
    'emanation': 5,
    'machine': 5,
    'organism': 5,
    'device': 5,
    'essence': 5,
}

const factoryProductionBlackList = [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM, RESOURCE_GHODIUM, RESOURCE_OXYGEN, RESOURCE_HYDROGEN, RESOURCE_CATALYST, RESOURCE_ENERGY];

const BASES = [RESOURCE_ENERGY, RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];

let task = { "to": null, "from": null, "amount": null, "resource": null };

let missingComponents = null

module.exports = {
    run(creep) {


        let factory = creep.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_FACTORY })[0];

        if (!factory || !creep.room.terminal) return;

        if (creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
            module.exports.resetTask();
        }

        if (!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }

        if (creep.memory["full"] == null) {
            creep.memory.full = false;
        }

        if (task.resource == null) {
            if (!module.exports.nextTask(creep, factory)) return;
        }

        if (creep.memory.full) {
            if (creep.transfer(task.to, Object.keys(creep.carry)[0]) == ERR_NOT_IN_RANGE) {
                module.exports.getInPosition(creep);
            }
        }
        else {
            if (creep.withdraw(task.from, task.resource, task.amount) == ERR_NOT_IN_RANGE) {
                module.exports.getInPosition(creep);
            }
        }
        
        if (factory.cooldown !== 0) return;

        var next = module.exports.nextReaction(factory);
        if (next != undefined) {
            factory.produce(next)
        }
        
    },

    getInPosition(creep) {
        let flag = Game.flags[creep.room.name];
        if (!flag) { creep.say("NO FLAG"); return; }
        creep.moveTo(flag.pos.x+2, flag.pos.y-2);
    },

    nextTask(creep, factory) {
        for (resource of BASES) {
            // console.log(resource, factory.store[resource] < factoryRequirements[resource])
            if (creep.room.terminal.store[resource] > 0 && factory.store[resource] < factoryRequirements[resource]) {
                task.resource = resource;
                task.from = creep.room.terminal;
                task.to = factory;
                task.amount = 50;
                return true;
            }
        }
        return false;
    },

    resetTask() {
        task = { "to": null, "from": null, "amount": null, "resource": null };
    },

    nextReaction(factory) {
        
        // todo
        // turn into filter function

        // filters out resources ive already got enough of
        // filters out resources i cant create due to missing any resources


        for (var commodity in COMMODITIES) {
            // console.log(JSON.stringify(COMMODITIES[commodity]))
            // console.log(COMMODITIES[commodity])
            // if item is not on blacklist
            if (!factoryProductionBlackList.includes(commodity)) {
                // if the factory does not have enough of the outcome of the reaction
                if (factory.store[commodity] < factoryRequirements[commodity]) {
                    // if the factory has the required level to make the reaction
                    if (factory.level == COMMODITIES[commodity].level || factory.level >= COMMODITIES[commodity].level) {

                        // get an array of missing components
                        missingComponents = _.filter(Object.keys(COMMODITIES[commodity]["components"]), (r) => !Object.keys(factory.store).includes(r) || factory.store[r] < COMMODITIES[commodity]["components"][r]);

                        // if the factory is not missing any components
                        if (missingComponents.length == 0) {
                            return commodity;
                        }
                    }
                }
            }
        }
    },


}