const terminalRequirements = {
    'battery':2000,
    "H": 2000,
    "O":2000,
    "U":2000,
    "L":2000,
    "Z":2000,
    // "X":2000,
    // "G":2000,
    'utrium_bar':800,
    'lemergium_bar':800,
    'zynthium_bar':800,
    'keanium_bar':800,
    'ghodium_melt':800,
    'oxidant':800,
    'reductant':800,
    'purifier':800,
    'composite':800,
    'crystal':800,
    'liquid':800,
    'wire':1000,
    'cell':1000,
    'alloy':1000,
    'condensate':1000,
    "silicon":1000,
    "metal":1000,
    "mist":1000,
    "biomass":1000,
    'switch':50, 
    'transistor':30,
    'microchip':10,
    'circuit':10,
    'phlegm':30,
    'tissue':30,
    'muscle':10,
    'organoid':5,
    'tube':30,
    'fixtures':30,
    'frame':10,
    'hydraulics':10,
    'concentrate':50,
    'extract':30,
    'spirit':20,
    'emanation':5,
    'machine':0,
    'organism':0,
    'device':0,
    'essence':0,
    'energy': 8000,
}

const factoryProductionBlackList = [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM, RESOURCE_GHODIUM, RESOURCE_OXYGEN, RESOURCE_HYDROGEN, RESOURCE_CATALYST, RESOURCE_ENERGY];


module.exports = {
    run: function(creep) {

        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }
        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }

        // console.log(Object.keys(creep.room.terminal.store))

        var factory = Game.getObjectById(creep.room.memory.factory)
        if (!creep.memory["full"]) {
            // console.log(creep.room.terminal)

            // what factory needs
            var factoryNeeds = Object.keys(terminalRequirements).filter(thing => Object.keys(creep.room.terminal.store).includes(thing) && terminalRequirements[thing] > factory.store[thing])

            var r = factoryNeeds[0];
            creep.say(r);
            //[factoryNeeds.length - 1];
            var amountRequired = terminalRequirements[r] - factory.store[r];
            
            
            
            if(creep.withdraw(creep.room.terminal, r, (amountRequired < creep.store.getCapacity() ? amountRequired : creep.store.getCapacity())) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.terminal)
            }
        }
        else {
            if(creep.transfer(factory, _.last(_.keys(creep.store))) == ERR_NOT_IN_RANGE) {
                creep.moveTo(factory)
            }

            
        }

    

        // FACTORY SECTION

        function canCreate(commodity) {
            for (i in commodity.components) {
                if (!Object.keys(factory.store).includes(i) || factory.store[i] < commodity.components[i]) {
                    return false;
                }
            }
            if (commodity.level == undefined || commodity.level <= factoryLevel) {
                return true;
            }
            else {
                return false;
            }
        }
        
        if (factory.cooldown === 0) {
            var factoryLevel = (!factory.level) ? 0 : factory.level;
            var possible = Object.values(COMMODITIES).filter(canCreate);

            for (i = 0; i < possible.length; i++) {
                var commodity = Object.keys(COMMODITIES).find(key => COMMODITIES[key] === possible[i]);
                if (factory.store[commodity] < terminalRequirements[commodity]) {
                    if (!factoryProductionBlackList.includes(commodity)) {
                        console.log(commodity)
                        factory.produce(commodity);
                        return;
                    }
                    
                }
            }
        }
    },
};