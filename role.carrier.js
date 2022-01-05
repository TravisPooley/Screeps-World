module.exports = {
    run: function(creep) {
        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        else if(!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }
        else {
            creep.memory.full = false;
        }

        if (!creep.memory["full"]) {
            if(creep.withdraw(module.exports.source()) == ERR_NOT_IN_RANGE) {
                creep.moveTo(module.exports.source(), {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
            if(creep.transfer(module.exports.destination(), creep.memory.resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(module.exports.destination(), {visualizePathStyle: {stroke: '#ff0000'}});
            }

            if (creep.memory.build == true) {
                module.exports.tryRepair(creep);
                module.exports.tryConstruction(creep);
            }
        }

        // tryPickup(creep);
    
    },
    tryPickup: function(creep) {
        // let target = this.source(creep).isCreep ? this.source(creep) : (logistic.storeFor(this.source(creep)) || this.source(creep));

        // if(creep.pos.isNearTo(target)) {
        //     this.withdraw(creep, target);
        
        // } else {
        //     creep.goTo(target);
        // }
    },
    tryRepair: function() {
        var road = _.find(creep.pos.lookFor(LOOK_STRUCTURES), (s) => s.structureType == STRUCTURE_ROAD);
        if(road) {
            if(road.hits / road.hitsMax <= 0.6) {
                creep.repair(road);
            }
        }
    },
    tryConstruction: function(creep) {
        var constructionSite = _.find(creep.pos.lookFor(LOOK_CONSTRUCTION_SITES), (cs) => cs.structureType == STRUCTURE_ROAD);
        if(constructionSite) {
            creep.build(constructionSite);
        }
    },
    source: function(creep) {
        return Game.getObjectById(creep.memory.source);
    },
    destination: function(creep) {
        // return Game.getObjectById(creep.memory.destination);
        return Game.getObjectById(creep.memory.target);

        
    },
}