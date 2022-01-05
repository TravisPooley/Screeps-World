const factoryRequirements = {
    'energy': 8000,
    'battery':2000,
    "H": 2000,
    "O":2000,
    "U":2000,
    "L":2000,
    "Z":2000,
    "X":2000,
    "G":2000,
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
    'machine':5,
    'organism':5,
    'device':5,
    'essence':5,
}

var excess = {}

const factoryProductionBlackList = [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM, RESOURCE_GHODIUM, RESOURCE_OXYGEN, RESOURCE_HYDROGEN, RESOURCE_CATALYST, RESOURCE_ENERGY];

module.exports = class Factory {
    constructor(room) {
        if(!room.memory.factory) {
            room.memory.factory = {
                product: null
            };
        }


        this.room = room;
        this.product;
        this.factory = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_FACTORY })[0];
    }

    run() {
        if (this.isAvailable() && this.cooldown() === 0) {
            var next = this.nextReaction();
            // console.log('next reaction in factory:',next)
            if (next != undefined) {
                this.factory.produce(next);
            }
        }
    }

  

    nextReaction() {
        for (var commodity in COMMODITIES) {
            // if item is not on blacklist
            if (!factoryProductionBlackList.includes(commodity)) {
                // if the factory does not have enough of the outcome of the reaction
                if (this.factory.store[commodity] < factoryRequirements[commodity]) {
                    // if the factory has the required level to make the reaction
                    if (this.factory.level == COMMODITIES[commodity].level || this.factory.level >= COMMODITIES[commodity].level) {
                        
                        // get an array of missing components
                        var missingComponents = _.filter(Object.keys(COMMODITIES[commodity]["components"]), (r) => !Object.keys(this.factory.store).includes(r) || this.factory.store[r] < COMMODITIES[commodity]["components"][r]);

                        // if the factory is not missing any components
                        if(missingComponents.length == 0) {
                            return commodity;
                        } 
                    }
                }
            }
        }
    }

    isAvailable() {
        return !!this.factory;
    }

    cooldown() {
        return this.factory.cooldown;
    }

}