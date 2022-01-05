const config = require("config");

module.exports = {

    getResources(amount, amounts, bases, reactions, element) {
        var test = amounts;
        if (!bases.includes(element)) {
            if (Object.keys(reactions).includes(element)) {
                test = this.getResources(amount, test, bases, reactions, reactions[element].partOne);
                
                if (!bases.includes(reactions[element].partOne)) {
                    test[reactions[element].partOne] = test[reactions[element].partOne] + amount;
                }

                test = this.getResources(amount, test, bases, reactions, reactions[element].partTwo);

                if (!bases.includes(reactions[element].partTwo)) {
                    test[reactions[element].partTwo] = test[reactions[element].partTwo] + amount;
                }
            }
            else {
                test[element] = test[element] + amount;
            }
        }
        return(test)
    },
    randomProperty(obj) {
    var keys = Object.keys(obj);
    return keys[ keys.length * Math.random() << 0];
    },
    getMostExpensiveBuyOrder(resource) {
        var orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: resource});
        orders = orders.sort(function (a, b) { return b.price - a.price })
        return(orders[0]);
    },
    spawn(spawns, body, name, memory) {
        // console.log(spawns, body, name, memory)
        spawns.forEach(spawn => {
            if (spawn.spawning == null && spawn.room.energyAvailable >= this.bodyCost(body)) {
                if (spawn.spawnCreep(body, name, memory) == OK) return "OK";
            }
        });
        return "ERR_NO_SPAWN";
    },
    BuildBody(base, room, max) {
        var arr = [];
        for (var i = 0; i <= (max || Math.floor(50/base.length)); i++) {
            var temp = arr.concat(base);
            if (this.bodyCost(temp) <= room.energyCapacityAvailable && temp.length < 50) {
                arr = arr.concat(base);
            }
        };
        
        return(arr.sort(function (a, b) {return config.body.indexOf(a) - config.body.indexOf(b);}));
        // console.log(room.name)
        // console.log(base)
        // console.log(arr)
        // console.log(arr.length)
        // console.log(room.energyCapacityAvailable)
        // console.log(this.bodyCost(arr))
        // console.log()
        
    },
    bodyCost (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },
    AquireEnergy(creep) {
        if (creep.room.memory.containers) {
            var containers = this.SortContainersByRange(creep, creep.room.memory.containers);
            if (containers[0]) {
                creep.memory.target = containers[0].id
            }
        }
        else if (creep.room.storage) {
            creep.memory.target = creep.room.storage.id;
        }

        var target = Game.getObjectById(creep.memory.target)
        if (target && target.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()) {
            this.tryElseMove(creep, target, "red", "withdraw");
            creep.memory.target = undefined;
        }
        else {
            creep.memory.target = undefined;
        }
    
    
    },
    getContainers(room) {
        var containers = [];
        room.memory.containers.forEach(container => {
            containers.push(Game.getObjectById(container));
        });
        return(containers);
    },
    SortByEnergy(targets) {
        return(targets.sort(function(a, b) { return  b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY] }));
    },
    SortContainersByRange(creep, roomsContainers) {
        containers = [];
        roomsContainers.forEach(container => {
            var temp = Game.getObjectById(container);
            if (temp && temp.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()) {
                containers.push(temp);
            }
        });
        return(containers.sort(function(a, b) { return  creep.pos.findClosestByPath(b) - creep.pos.findClosestByPath(a) }));
    },
    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    },
    GetClosestSpawn(room) {
        return(_(Object.values(Game.spawns).filter(spawn => spawn.room.name == room)));
    },
    GetAmountOfRole(role) {
        return (_(Game.creeps).filter({ memory: { role: role } }).value().length);
    },
    GetAmountOfRoleTargeting(role, target) {
        return (_(Game.creeps).filter({ memory: { role: role, target: target } }).value().length);
    },
    GetAmountOfRoleWithRoom(role, target) {
        return (_(Game.creeps).filter({ memory: { role: role, room: target } }).value().length);
    },
    GetAmountOfTarget(target) {
        return (_(Game.creeps).filter({ memory: { target: target } }).value().length);
    },
    nameScreep(prefix) {
        for (i = 1; i < 999; i++) {
            var newName = prefix+"-"+i;
            if (!Object.keys(Game.creeps).includes(newName)) {
                return(newName);
            }
        }
    },
    OccupiedSource(souce, job) {
        return (_(Game.creeps).filter({ memory: { target: souce, role: job } }).value().length);
    },
    findBestDroppedEnergy(room) {
        var targets = room.find(FIND_DROPPED_RESOURCES);
        targets.sort((a,b) => b.energy - a.energy);
        return(targets);
    },
    DroppedEnergySum(room) {
        return(_.sum(room.find(FIND_DROPPED_RESOURCES), 'energy'));
    },
    moveTo(creep, target, color) {
        switch(color) {
            case 'black': color = '#000000'; break;
            case 'white': color = '#ffffff'; break;
            case 'red': color = '#ff0000'; break;
            case 'green': color = '#00ff00'; break;
            case 'blue': color = '#0000ff'; break;
            case 'cyan': color = '#00ffff'; break;
            case 'magenta': color = '#ff00ff'; break;
            case 'yellow': color = '#ffff00'; break;
        };
        return creep.moveTo(target, {visualizePathStyle: {stroke: color}});
    },
    tryElseMove(creep, target, color, method) {
        let response = creep[method](target, RESOURCE_ENERGY);
        if(response == ERR_NOT_IN_RANGE) {
            return this.moveTo(creep, target, color);
            
        } else {
            return response;
        }
    },
    hash(str) {
        let hash = 0;
            for (n = 0; n < str.length; n++) {
                hash += str.charCodeAt(n);
            }
        return hash;
    },
    storeEnergy(creep) {
        var storage = this.findContainerNotFull(creep);
        if(storage != null) {
            this.tryElseMove(creep, storage, "yellow", "transfer");
        }
        else {
            var storage = this.findContainerNotEmpty(creep);
            if (storage != null && storage.hits < storage.hitsMax) {
                creep.repair(storage);
            }
            else {
                creep.drop(RESOURCE_ENERGY);
            }
        
        }
    },
    findStoreNotFull(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_STORAGE || a.structureType == STRUCTURE_TOWER).filter(a => a.store.getFreeCapacity(RESOURCE_ENERGY) > 5));
    },
    findStoreNotEmpty(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_STORAGE).filter(a => a.store.getUsedCapacity(RESOURCE_ENERGY) > 5));
    },
    findStorageNotEmpty(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_STORAGE).filter(a => a.store.getUsedCapacity(RESOURCE_ENERGY) > 5));
    },
    findStorageNotFull(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_STORAGE).filter(a => a.store.getFreeCapacity(RESOURCE_ENERGY) > 5));
    },
    findStore(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_STORAGE));
    },
    findContainerNotFull(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER).filter(a => a.store.getFreeCapacity(RESOURCE_ENERGY) > 5));
    },
    findContainerNotEmpty(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER).filter(a => a.store.getUsedCapacity(RESOURCE_ENERGY) > 5));
    },
    getEnergy(creep) {
        var container = this.findStoreNotEmpty(creep);
        if (container != null) {
            this.tryElseMove(creep, container, "blue", "withdraw");
        } else {
            require('harvester').zergHarvester(creep);
        }
    },
    build(creep){
        // if target is defined and creep is not in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }

        // if there is no target set
        if (creep.memory.target == undefined) {
            creep.memory.target = creep.room.name;
        }

        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // const priorities = ["extension", "road"];

            // var test = creep.room.find(FIND_CONSTRUCTION_SITES);

            // test.sort((a,b) => priorities.indexOf(a.structureType) - priorities.indexOf(b.structureType));

            // console.log(test[0])

            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // console.log(constructionSite.progress)
                
                // console.log(constructionSite.progressTotal)
                // console.log(constructionSite.progress == constructionSite.progressTotal)
                // console.log(constructionSite.structureType)
                this.tryElseMove(creep, constructionSite, "blue", "build");
            }
            // if no constructionSite is found
            else {
                //require('harvester').zergHarvester(creep);
            }
        }
        // if creep is supposed to get energy
        else {
            this.getEnergy(creep);
        }
    },
};