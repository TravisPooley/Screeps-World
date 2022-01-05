const bodyOrder = [TOUGH,CARRY,WORK,CLAIM,ATTACK,RANGED_ATTACK,MOVE,HEAL];

module.exports = {
    spawn: function(spawns, body, name, memory) {
        // console.log(spawns, body, name, memory)
        spawns.forEach(spawn => {
            // console.log('e', spawn.spawning)
            // console.log(spawn.spawning == null, spawn.room.energyAvailable >= this.bodyCost(body))
            // if (spawn.spawning == null && spawn.room.energyAvailable >= this.bodyCost(body)) {
            if (spawn.spawnCreep(body, name, memory) == OK) {
                return(OK)
            }
            return(ERR_BUSY)
        });
    },
    BuildBody: function(base, room, max) {
        var arr = [];
        for (var i = 0; i <= (max || Math.floor(50/base.length)); i++) {
            var temp = arr.concat(base);
            if (this.bodyCost(temp) <= room.energyCapacityAvailable && temp.length < 50) {
                arr = arr.concat(base);
            }
        };
        return(this.sortBody(arr));
    },
    sortBody: function(body) {
        return(body.sort(function (a, b) {return bodyOrder.indexOf(a) - bodyOrder.indexOf(b);}));
    },
    bodyCost: function(body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },
    addIfPossible: function(body, part, amount) {

    },
    calculateMinerBody: function(mineral) {
        let configs = [];

        let workNeeded = Math.ceil(mineral.mineralAmount * EXTRACTOR_COOLDOWN / CREEP_LIFE_TIME);
        workNeeded = Math.max(workNeeded, 5);
        for(let parts = Math.min(workNeeded, 32); parts > 2; parts -= 1) {
            configs.push(this.makeParts(parts, WORK, 2, CARRY, Math.ceil(parts / 2), MOVE));
        }

        return configs;
    },
    harvesterBody: function(room, spawns, name, memory) {
        const confirations = {
            300: [WORK, WORK, CARRY, MOVE],
            350: [WORK, WORK, CARRY, MOVE, MOVE],
            400: [MOVE, MOVE, MOVE, WORK, WORK, CARRY],
            450: [MOVE ,MOVE, WORK, WORK, WORK, CARRY],
            500: [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY],
            550: [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY],
            600: [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY],
            650: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY],
            700: [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY],
            750: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY],
            800: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            850: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            900: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            950: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
        }
        let test = (room.energyCapacityAvailable > 950 ? confirations[950] : confirations[room.energyCapacityAvailable]);
        // console.log(test)
        if (test.length > 3) {
            this.spawn(spawns, this.sortBody(test), name, memory);
        }
    },
    
    // INCOMPLETE
    buildHarvester: function(room, spawns, name, memory) {
        let body = [CARRY];
        while (this.bodyCost(body) < (room.energyAvailable-100) && body.length < 11) {
            if (body.filter(x => x === MOVE).length > Math.ceil(body.filter(x => x === WORK).length/2)) {
                body.push(WORK);
            }
            else {
                body.push(MOVE);
            }
        }
        if (body.length > 3) {
            this.spawn(spawns, this.sortBody(body), name, memory);
        }        
    },
    getWorkParts: function(room, source) {
        let parts = 0;
        this.localCreepsWithRole(room, "efficientHarvester").forEach(creep => {
            if (creep.memory.target == source) {
                parts += creep.getActiveBodyparts(WORK)
            }
        });
        return(parts);
    },

    localCreepsWithRole: function(room, role) {
        let creeps = room.find(FIND_MY_CREEPS);
        creeps = creeps.concat(_.compact(_.map(Game.spawns, (spawn) => spawn.spawning && Game.creeps[spawn.spawning.name])));
        return _.filter(creeps, (creep) => creep.memory.role == role);
    },
    numberOfLocalCreeps: function(roomai, role) {
        return this.localCreepsWithRole(roomai, role).length;
    },





    bestAvailableParts: function(room, partConfigs) {
        return this.bestPartsForPrice(partConfigs, room.energyCapacityAvailable);
    },
    bestAffordableParts: function(room, partConfigs, includeStorage) {
        var energy = room.energyAvailable;
        if(includeStorage && room.storage) {
            energy += room.storage.store.energy;
            energy = _.min([energy, room.energyCapacityAvailable]);
        }
        return this.bestPartsForPrice(partConfigs, energy);
    },
    bestPartsForPrice: function(partConfigs, price) {
        let spawnHelper = this;
        let config = _.find(partConfigs, function(config) {
                    return spawnHelper.costForParts(config) <= price;
                });
        return config || _.last(partConfigs);
    },
    // costForParts: function(parts) {
    //     return _.sum(_.map(parts, (part) => BODYPART_COST[part]))
    // },
    makeParts: function() {
        let parts = [];
        for (let i = 0; i < arguments.length; i += 2) {
            let count = arguments[i];
            let type = arguments[i + 1];
            parts = parts.concat(Array(count).fill(type));
        }

        return parts;
    },
    spawnDuration: function(config) {
        if(!config) return 0;
        return config.length * CREEP_SPAWN_TIME;
    },
    
    globalCreepsWithRole: function(role) {
        if(!this._globalCreepCache || this._globalCreepCacheTime !== Game.time) {
            this._globalCreepCacheTime = Game.time;
            this._globalCreepCache = _.groupBy(Game.creeps, (c) => c.memory.role);
        }

        return this._globalCreepCache[role] || [];
    }
}