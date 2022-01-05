const helper = require('helper');
const spawnHelper = require("helper.spawning");

module.exports = class Links {
    constructor(room) {
        this.room = room;
        this.storage = room.storage;
        this.memory = room.memory;
        this.controllerLevel = room.memory.controllerLevel
        this.getSpawns()
    }

    run(roomDefcon, spawns) {
        // this.manageLast();
        // this.manageTransfer();
        // this.manageHopper();
        if (roomDefcon >= 5) {
            
            // this.manageHarvester();

            if (this.room.controller.level < 4) {
                // this.manageUpgraders();
                // this.manageBuilders();
            }
            
            if (this.harvesterSatisfied) {

                // this.manageConstrction();

                if (this.room.controller.level >= 3) {
                    // this.manageUpgraders();
                }

                // this.manageTransporters();

                // this.manageMineralHarvester();

                // this.manageBuilders();
                
                // this.manageJew();


                // this.manageRaid();

                
                if (Game.time % 250 == 0) {
                    this.manageExpansionBuilder();
                    
                    if (this.controllerLevel == 8) {
                        this.manageRampartUpgraders();
                    }
                }

            }

            // if (Game.time % 10 == 0) {
            //     this.manageJew();
            // }
        }
        // else if (roomDefcon < 4) {
        //     // spawn defender
        //     this.manageDefnder();
        // }
        
    }

    getSpawns() {
        this.spawns = Object.values(Game.spawns).filter(spawn => spawn.room == this.room);
    }
    manageLast() {
        if ((helper.GetAmountOfRoleWithRoom("efficientHarvester", this.room.name) + helper.GetAmountOfRoleWithRoom("harvester", this.room.name) + helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) == 0) || (helper.GetAmountOfRoleWithRoom("transfer", this.room.name) + helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) == 0)) {
            spawnHelper.spawn(this.spawns, [WORK, CARRY, MOVE], helper.nameScreep("Upgrader"), { memory: { role: 'upgrader', room: this.room.name } });
        }
    }
    manageDefnder() {
        if (helper.GetAmountOfRoleWithRoom("rangedDefender", this.room.name) < 3) {
            spawnHelper.spawn(this.spawns, helper.BuildBody([RANGED_ATTACK, RANGED_ATTACK, MOVE], this.room, null), helper.nameScreep("Defender"), { memory: { role: 'rangedDefender' } });   
        }
    }
    manageClaimer() {
        var flag = Game.flags[this.room.name+" EXPANSION"];
        if (flag) {
            spawnHelper.spawn(this.spawns, [CLAIM, MOVE, MOVE], helper.nameScreep("Claimer"), { memory: { role: 'claimer', room: this.room.name, target: (JSON.parse(JSON.stringify(flag.pos))).roomName } });
        }
    }
    manageHauler() {
        spawnHelper.spawn(this.spawns, helper.BuildBody([CARRY, CARRY, MOVE], this.room, null), helper.nameScreep("Hauler"), { memory: { role: 'mineralHarveseter', target: this.room.memory["minerals"][0] } });
    }
    manageExpansionBuilder() {
        // find cloest if thats this room spawn
        // 
        var targets = Object.values(Game.constructionSites).filter((structure) => structure.structureType == STRUCTURE_SPAWN);
        var allSpawns = Object.values(Game.structures).filter((structure) => structure.structureType == STRUCTURE_SPAWN);

        if (targets.length > 0 && targets[0].room) {
            var spawns = _.sortBy(allSpawns, s => s.pos.getRangeTo(targets[0]))

            if (spawns[0] && helper.GetAmountOfRoleTargeting("builder", targets[0].room.name) < 3 ) {
                spawnHelper.spawn([spawns[0]], helper.BuildBody([WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Builder"), { memory: { role: 'builder', target: targets[0].room.name } });
            }
        }
    }
    manageRampartUpgraders() {
        if (this.room.storage && this.room.storage.store[RESOURCE_ENERGY] > 500000 && helper.GetAmountOfRoleTargeting("builder", this.room.name) < 1) {
                spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Builder"), { memory: { role: 'builder', target: this.room.name } });   
        }
    }
    manageBuilders() {
        var constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length > 0 && !this.room.storage && helper.GetAmountOfRoleTargeting("builder", this.room.name) < 4 && helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) > 0) {
            spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Builder"), { memory: { role: 'builder', target: this.room.name } });
        }
        if (constructionSites.length > 0 && (helper.GetAmountOfRoleWithRoom("efficientHarvester", this.room.name) >= this.room.memory.sources.length || helper.GetAmountOfRoleWithRoom("harvester", this.room.name) > 1)) {
            if (helper.GetAmountOfRoleTargeting("builder", this.room.name) < (constructionSites.length / 10) ) {
                // 
                // if (!storage || (storage && storage.store[RESOURCE_ENERGY] > 50000)) {  
                    var max = (this.room.storage) ? (Math.floor(this.room.storage.store[RESOURCE_ENERGY] / 100000) + 1) : 1;
                    spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, CARRY, MOVE], this.room, max), helper.nameScreep("Builder"), { memory: { role: 'builder', target: this.room.name } });   
                // }
            }
        }
    }
    manageJew() {
        var amount = helper.DroppedEnergySum(this.room);
        var needed = amount > 150 ? (amount / 500) + 1 : 0;
        if (helper.GetAmountOfRoleWithRoom("jew", this.room.name) < needed && helper.GetAmountOfRoleWithRoom("jew", this.room.name) < 5) {
            spawnHelper.spawn(this.spawns, [CARRY, MOVE], helper.nameScreep("J"), { memory: { role: 'jew', room: this.room.name } });
        }
    }
    manageNukeOperator() {
        if (helper.GetAmountOfRoleWithRoom("nukeOperator", this.room.name) < 1) {
            spawnHelper.spawn(this.spawns, [CARRY, CARRY, MOVE], helper.nameScreep("Nuke Operator"), { memory: { role: 'nukeOperator', room: this.room.name} });
        }
    }
    manageHopper() {
        if (helper.GetAmountOfRoleWithRoom("hopper", this.room.name) < 1 && this.room.storage && this.room.controller.level >= 5) {
            spawnHelper.spawn(this.spawns, [CARRY, CARRY], helper.nameScreep("Hopper"), { memory: { role: 'hopper', room: this.room.name} });
        }
    }

    manageMineralHarvester() {
        if (this.room.controller.level < 6) return;
        if (this.room.memory.extractor && this.room.memory.mineralActive && this.room.memory["minerals"][0] && helper.GetAmountOfRoleTargeting("mineralHarveseter", this.room.memory["minerals"][0]) < 1 && this.room.terminal && this.room.terminal.store[this.room.memory["mineralsTypes"][0]] < 100000) {
            spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Mineral"), { memory: { role: 'mineralHarveseter', target: this.room.memory["minerals"][0] } });
        }
    }

    manageUpgraders() {
        if (this.controllerLevel == 8) {
            if (helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) < 1) {
                spawnHelper.spawn(this.spawns, [WORK, CARRY, MOVE], helper.nameScreep("Upgrader"), { memory: { role: 'upgrader', room: this.room.name } });
            }
        }
        else {
            if (this.storage) {
                if (helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) < (Math.floor(this.storage.store[RESOURCE_ENERGY] / 75000) + 1) && helper.GetAmountOfRoleWithRoom("efficientHarvester", this.room.name) >= this.room.memory.sources.length) {
                    spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Upgrader"), { memory: { role: 'upgrader', room: this.room.name} });
                }

            }
            else if (this.room.controller.level < 3) {
                if (helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) < 5) {
                    spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Upgrader"), { memory: { role: 'upgrader', room: this.room.name } });
                }
            }
            else {
                if (helper.GetAmountOfRoleWithRoom("upgrader", this.room.name) < (helper.GetAmountOfRoleWithRoom("efficientHarvester", this.room.name) * 5.5)) {
                    spawnHelper.spawn(this.spawns, helper.BuildBody([WORK, CARRY, MOVE], this.room, null), helper.nameScreep("Upgrader"), { memory: { role: 'upgrader', room: this.room.name } });
                }
            }
        }
    }
    manageTransporters() {
        if (!!this.room.memory.sourceContainers && !!this.room.storage) {
            for (var source in this.room.memory.sourceContainers) {
                if ((helper.OccupiedSource(this.room.memory.sourceContainers[source], "transport") < 1 || (this.room.memory.sourceDistance && helper.OccupiedSource(this.room.memory.sourceContainers[source], "transport") < Math.ceil(this.room.memory.sourceDistance[source] / 25))) && (!this.room.memory.sourceLinks[source] || !this.room.memory.mainLink)) {
                    spawnHelper.spawn(this.spawns, helper.BuildBody([CARRY, CARRY, MOVE], this.room, 4), helper.nameScreep("Transporter"), { memory: { role: 'transport', target: this.room.memory.sourceContainers[source], room: this.room.name } });
                }
            }
        }
    }

    manageTransfer() {
        if (this.storage && helper.GetAmountOfRoleWithRoom("transfer", this.room.name) < 1 && this.room.energyCapacityAvailable >= 800 && (helper.GetAmountOfRoleWithRoom("efficientHarvester", this.room.name) > 1)) {
            spawnHelper.spawn(this.spawns, helper.BuildBody([CARRY, CARRY, MOVE], this.room, 4), helper.nameScreep("Transfer"), { memory: { role: 'transfer', room: this.room.name } });
        }
    }


    
    harvesterBuilder() {
        let body = [CARRY];
        let cost = BODYPART_COST[CARRY];
        let work = 0;
        let move = 0
        while (cost < this.room.energyAvailable && work < 10) {
            if (move < work/2) {
                move++;
                body.push(MOVE);
                cost += BODYPART_COST[MOVE];
            }
            else {
                work++;
                body.push(WORK);
                cost += BODYPART_COST[WORK];
            }
        }
        return body;    
    }
    spawnHarvester(memory) {
        spawnHelper.spawn(this.spawns, this.harvesterBuilder(), helper.nameScreep("Harvester"), memory);
    }
    manageHarvester() {
        
        if (this.room.controller.level < 3) return;

        var possible = this.room.memory.sources;
        possible.forEach(source => {
            // spawnHelper.getWorkParts(room, source)
            if (helper.OccupiedSource(source, "efficientHarvester") < 1) {
                this.spawnHarvester({ memory: { role: 'efficientHarvester', target: source, room: this.room.name } });
                // spawnHelper.spawn(spawns, [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], ('Harvester: ' + source), { memory: { role: 'efficientHarvester', target: source, room: room.name } });
                // spawnHelper.buildHarvester(this.room, this.spawns, helper.nameScreep("Harvester"), { memory: { role: 'efficientHarvester', target: source, room: this.room.name } });
            }
        });

        if (helper.GetAmountOfRoleWithRoom("efficientHarvester", this.room.name) >= this.room.memory.sources.length) {
            this.harvesterSatisfied = true;
        }
        else {
            this.harvesterSatisfied = false;
        }    
    }
}