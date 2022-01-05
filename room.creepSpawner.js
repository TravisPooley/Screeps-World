const helper = require('helper');
const roomBase = require('room.base');
const enemy = require("helper.allyManager");

const BODY_CONFIG = [TOUGH,CARRY,WORK,CLAIM,ATTACK,RANGED_ATTACK,MOVE,HEAL];


module.exports = class roomCreepSpawner {
    constructor(room) {
        this.room = room;
        this.spawnQueue = {};
        this.roomCreeps = {};
    }

    run(roomDefcon, spawns, room) {

        this.room = room;

        this.getCreeps(spawns, room);


        if (this.manageLast(spawns, room)) return;

        // console.log(room.name)
        // console.log(JSON.stringify(this.roomCreeps))

        if (roomDefcon < 4) this.manageDefnder(spawns, room);

        if (this.manageUpgrader(spawns, room)) return;

        this.manageRemote(spawns, room);

        this.manageBuilders(spawns, room);
        
        if (room.controller.level < 3) return;
        
        this.manageHarvester(spawns, room);

        if (room.controller.level == 3) this.manageTempTransporters(spawns, room);

        if (roomDefcon == 5) this.manageRampartUpgraders(spawns, room);

        if (!room.storage && !room.terminal) return;

        this.manageHopper(spawns, room);
        this.manageTransfer(spawns, room);

        if (roomDefcon < 5) return;

        
        this.manageTransporters(spawns, room);

        if (this.manageTransfer(spawns, room)) return;

        if (room.controller.level < 6) return;

        this.manageScientist(spawns, room);

        this.manageMineralHarvester(spawns, room);
        this.manageMineralHauler(spawns, room);
    

    }

    manageRemote(spawns, room) {
        if (!room.memory.remote || room.memory.remote.length <= 0) return
        for (let remote of room.memory.remote) {
            // observe room if is not visible
            if (!Game.rooms[remote] && !this.manageRoleTargeting("scout", remote)) {
                this.spawn(room, spawns, [MOVE], this.nameCreep("Observer", remote), { memory: { role: 'scout', room: room.name, target:remote, operation:"observe" } });
                return
            }
            else if (!Game.rooms[remote]) continue;
            else {
                let enemies = enemy.findHostiles(Game.rooms[remote]);
                if (enemies.length == 1 && enemies[0].body.length == 1 && !this.manageRoleTargeting("attacker", remote)) this.spawn(room, spawns, [ATTACK, MOVE], this.nameCreep("Bycrome", remote), { memory: { role: 'attacker', room: room.name, target:remote } });
                else if (enemies.length > 0) {
                    // if the enemy is an invader send a hybrid
                    if (enemies[0].owner.username == "Invader") {
                        spawnHybrid(room.name, remote.name,false);
                    }
                    else {
                        removeRemote(room.name, remote.name);
                    }
                }

                if (Game.rooms[remote].controller && (Game.rooms[remote].controller.reservation == undefined || Game.rooms[remote].controller.reservation < 1500) && !this.manageRoleTargeting("reserver", remote)) this.spawn(room, spawns, this.BuildBody([CLAIM, MOVE], room, null), this.nameCreep("Reserver", remote), { memory: { role: 'reserver', room: room.name, target:remote} });

                if (Game.time % 75 == 0) {
                    for (let source of Game.rooms[remote].find(FIND_SOURCES)) {
                        // console.log('testing123')
                        roomBase.buildRoadTo(room, source);
                    }

                    let builder = this.manageRoleTargeting("builder", remote);
                    if (!builder || builder.length < 3) this.manageBuilders(spawns, room, Game.rooms[remote]);
                    
                }

                // find enemies
               
    
                this.manageHarvester(spawns, room, Game.rooms[remote]);
                this.manageTransporters(spawns, room, Game.rooms[remote]);
            }
            
        
           

        }

            // if (this.manageRole("remoteHarvester", 1)) {
            //     this.manageRole("remoteTransporter", 1);
            // }
        
    }

    manageTempTransporters(spawns, room) {
        if (!room.memory.remote || room.memory.remote.length <= 0) return;
        if (!room.memory.sourceContainers) return;
        
        if (this.GetAmountOfRoleWithRoom("Harvester", room.name) < room.memory.sources.length) return;

        for (var source in room.memory.sourceContainers) {
            if (!room.memory.sourceContainers[source]) continue;
            if (helper.OccupiedSource(room.memory.sourceContainers[source], "hauler") < 2) {
                let container = room.controller.pos.findInRange(FIND_STRUCTURES, 1);
                container = container.filter(structure => structure.structureType == STRUCTURE_CONTAINER).shift();
                if (container) {
                    this.spawn(room, spawns, this.BuildBody([CARRY, CARRY, MOVE], room, 4), this.nameCreep("transport", room.name), { memory: { role: 'hauler', target: room.memory.sourceContainers[source], to:container.id, room: room.name } });
                }
            }
        }
    }

    manageScientist(spawns, room) {
        // console.log(room.name, !room.terminal , !room.memory.reaction , room.memory.primaryLab , room.memory.secondaryLab, !room.memory.tertiaryLab)
        if (!room.terminal || !room.memory.reaction || !room.memory.primaryLab || !room.memory.secondaryLab || !room.memory.tertiaryLab) return;
        if(this.manageRole("scientist", 1)) {
            if ((Object.keys(room.storage.store).includes(RESOURCE_ENERGY) && room.storage.store[RESOURCE_ENERGY] > 20000) || (Object.keys(room.terminal.store).includes(RESOURCE_ENERGY) && room.terminal.store[RESOURCE_ENERGY] > 10000)) {
                this.spawn(room, spawns, [CARRY, MOVE], this.nameCreep("Scientist", room.name), { memory: { role: 'scientist', room: room.name} });
            }
        }
    }

    manageRampartUpgraders(spawns, room) {
        if (room.storage && room.storage.store[RESOURCE_ENERGY] > 40000 && this.manageRole("builder", 1)) {
            this.spawn(room, spawns, this.BuildBody([WORK, CARRY, MOVE], room, room.storage.store[RESOURCE_ENERGY]/25000), this.nameCreep("Builder", room.name), { memory: { role: 'builder', target: room.name , room: room.name} });   
        }
    }

    harvesterBuilder(limit, room) {
        let body = [CARRY];
        let cost = BODYPART_COST[CARRY];
        let work = 0;
        let move = 0
        while (cost < room.energyAvailable && work < limit && body.length < 50) {
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

    manageHarvester(spawns, room, target = room) {
        var possible = target.memory.sources;
        // console.log(room != target, target)
        if (room == target && !this.manageRole("Harvester", possible.length)) return(true);
        // console.log(room.name + " " + room.memory.sources.length)
        possible.forEach(source => {
            let creep = this.manageRoleTargeting("Harvester", source);
            // if (!creep || (creep.ticksToLive <= creep.body.length * 3)) {
            if (!creep) {
                // console.log(target, source, creep)
                // console.log(!creep)
                let body = this.harvesterBuilder(10, room);
                if (body.length < 3) return;
                this.spawn(room, spawns, body, this.nameCreep("Harvester", target.name), { memory: { role: 'Harvester', target: source, room: target.name }});
            }
        });
    }

    manageDefnder(spawns, room) {
        if (this.manageRole("rangedDefender", 3)) {
            this.spawn(room, spawns, this.BuildBody([RANGED_ATTACK, RANGED_ATTACK, MOVE], room, null), this.nameCreep("Defender", room.name), { memory: { role: 'rangedDefender', room: room.name} });   
        }
    }
    manageMineralHarvester(spawns, room) {
        if (!this.manageRole("MineralHarveseter", 1)) return;
        let mineral = room.memory["minerals"][0];
        if (!room.memory.extractor || !room.memory.mineralActive || !mineral || !room.terminal ||  room.terminal.store[room.memory["mineralsTypes"][0]] > 50000) return;
        let creep = this.manageRoleTargeting("MineralHarveseter", mineral);
        if (!creep) {
            
            let body = this.harvesterBuilder(50, room);
            this.spawn(room, spawns, body, this.nameCreep("MineralHarveseter", room.name), { memory: { role: 'MineralHarveseter', target: mineral } });
        }
    }
    manageMineralHauler(spawns, room) {
        if (!this.manageRole("MineralHauler", 1)) return;
        let mineral = room.memory["minerals"][0];
        if (!mineral || !room.memory.mineralContainer) return
        let target = room.memory.mineralContainer[mineral];
        if (!room.memory.extractor || !room.memory.mineralActive || !mineral || !target || !room.terminal || room.terminal.store[room.memory["mineralsTypes"][0]] > 50000) return;
        let creep = this.manageRoleTargeting("MineralHauler", target);
        if (!creep) {
            this.spawn(room, spawns, this.BuildBody([CARRY, CARRY, MOVE], room, 4), this.nameCreep("MineralHauler", room.name), { memory: { role: 'MineralHauler', target: target, to: room.terminal.id } });
        }
    }

    manageHopper(spawns, room) {
        if (this.manageRole("Hopper", 1) && (room.storage || room.terminal) && room.controller.level >= 5) {
            this.spawn(room, spawns, [CARRY, CARRY], this.nameCreep("Hopper", room.name), { memory: { role: 'Hopper', room: room.name} })
        }
    }

    manageTransfer(spawns, room) {
        if (this.manageRole("Transfer", 1) && room.energyCapacityAvailable >= 800 && (this.GetAmountOfRoleWithRoom("Harvester")  > 1)) {
            this.spawn(room, spawns, this.BuildBody([CARRY, CARRY, MOVE], room, 4), this.nameCreep("Transfer", room.name), { memory: { role: 'Transfer', room: room.name } });
            return true;
        }
        return false;
    }

    manageLast(spawns, room) {
        if (this.manageRole("Upgrader", 1)) {
            this.spawn(room, spawns, [WORK, CARRY, MOVE], this.nameCreep("Upgrader", room.name), { memory: { role: 'Upgrader', room: room.name} });
            return true;
        }
        return false;
    }
    
    manageTransporters(spawns, room, target = room) {
        if (!target.memory.sourceContainers || (room == target && !room.storage)) return;
        
        if (room == target && this.GetAmountOfRoleWithRoom("Harvester", target.name) < target.memory.sources.length) return;

        // console.log(target)

        for (var source in target.memory.sourceContainers) {
            if (!!target.memory.sourceLinks[source] && !!target.memory.mainLink) continue;
            if (!target.memory.sourceContainers[source]) continue;
            let num = 1;
            if (target != room) num++;
            if (helper.OccupiedSource(target.memory.sourceContainers[source], "transport") < num) {
                // console.log("e",target)
                // spawnHelper.spawn(this.spawns, this.BuildBody([CARRY, CARRY, MOVE], room, 4), helper.nameScreep("Transporter"), { memory: { role: 'transport', target: room.memory.sourceContainers[source], room: room.name } });
                this.spawn(room, spawns, this.BuildBody([CARRY, CARRY, MOVE], room, 4), this.nameCreep("transport", target.name), { memory: { role: 'transport', target: target.memory.sourceContainers[source], room: room.name } });
            }
        }
    
    }

    manageNukeOperator(spawns, room) {
        if (helper.GetAmountOfRoleWithRoom("nukeOperator", room.name) < 1) {
            this.spawn(room, spawns, [CARRY, CARRY, MOVE], this.nameCreep("Nuke Operator", room.name), { memory: { role: 'nukeOperator', room: room.name} });
        }
    }

    manageClaimer(spawns, room) {
        var flag = Game.flags[room.name+" EXPANSION"];
        if (flag) {
            this.spawn(room, spawns, [CLAIM, MOVE, MOVE], this.nameCreep("Claimer", room.name), { memory: { role: 'claimer', room: room.name, target: (JSON.parse(JSON.stringify(flag.pos))).roomName } });
        }
    }


    // fix
    manageExpansionBuilder() {
        var targets = Object.values(Game.constructionSites).filter((structure) => structure.structureType == STRUCTURE_SPAWN);
        var allSpawns = Object.values(Game.structures).filter((structure) => structure.structureType == STRUCTURE_SPAWN);

        if (targets.length > 0 && targets[0].room) {
            var closest = _.sortBy(allSpawns, s => s.pos.getRangeTo(targets[0]))

            if (helper.GetAmountOfRoleTargeting("builder", targets[0].room.name) < 3 ) {
                this.spawn(closest, this.BuildBody([WORK, CARRY, MOVE], room, null), helper.nameScreep("Builder"), { memory: { role: 'builder', target: targets[0].room.name } });
            }
        }
    }

    
    manageBuilders(spawns, room, target = room) {
        if ( room == target && room.storage && this.GetAmountOfRoleWithRoom("Harvester", room.name) < room.memory.sources.length) return;
        var constructionSites = target.find(FIND_CONSTRUCTION_SITES);
        if (target != room && constructionSites.length > 0) {
            this.spawn(room, spawns, this.BuildBody([WORK, CARRY, MOVE], room, null), this.nameCreep("builder", target.name), { memory: { role: 'builder', target: target.name } });
        }
        else {
            if (!room.storage && constructionSites.length > 0 && helper.GetAmountOfRoleTargeting("builder", room.name) < 4 && this.GetAmountOfRoleWithRoom("Upgrader", room.name) > 0) {
                this.spawn(room, spawns, this.BuildBody([WORK, CARRY, MOVE], room, 3), this.nameCreep("builder", room.name), { memory: { role: 'builder', target: room.name } });
            }
            if (constructionSites.length > 0 && (this.GetAmountOfRoleWithRoom("Harvester", room.name) == room.memory.sources.length)) {
                if (helper.GetAmountOfRoleTargeting("builder", room.name) < (constructionSites.length / 10) ) {
                    // 
                    // if (!storage || (storage && storage.store[RESOURCE_ENERGY] > 50000)) {  
                        var max = (room.storage) ? (Math.floor(room.storage.store[RESOURCE_ENERGY] / 100000) + 1) : 1;
                        this.spawn(room, spawns, this.BuildBody([WORK, CARRY, MOVE], room, max), this.nameCreep("builder", room.name), { memory: { role: 'builder', target: room.name } });   
                    // }
                }
            }
        }
    }

    manageUpgrader(spawns, room) {
        if (room.controller.level == 8) {
            if (this.manageRole("Upgrader", 1)) {
                this.spawn(room, spawns, [WORK, CARRY, MOVE], this.nameCreep("Upgrader", room.name), { memory: { role: 'Upgrader', room: room.name } });
                return true
            }
        }
        else {
            let amount = 10;
            let max = 4;

            if (room.storage) {
                amount = (Math.floor(room.storage.store[RESOURCE_ENERGY] / 50000) + 1);
                max = null;
            }

            if (this.manageRole("Upgrader", amount)) {
                this.spawn(room, spawns, this.BuildBody([WORK, CARRY, MOVE], room, max), this.nameCreep("Upgrader", room.name), { memory: { role: 'Upgrader', room: room.name } });
                return true;
            }

        }
        return false
    }

    manageRole(role, amountNeeded) {
        if ((!this.roomCreeps[role] || this.roomCreeps[role] < amountNeeded)) {
            return true;
        }
        return false;
    }

    manageRoleTargeting(role, target) {
        return(Object.values(Game.creeps).find(creep => creep.memory.role == role && creep.memory.target == target));
    }

    GetAmountOfRoleWithRoom(role) {
        if (!this.roomCreeps[role]) return 0;
        else return this.roomCreeps[role];
    }

    nameCreep(role, roomName) {
        for (let i = 1; i < 999; i++) {
            var newName = role+"-"+roomName+"-"+i;
            if (!Object.keys(Game.creeps).includes(newName)) {
                return(newName);
            }
        }
    }

    getCreeps(spawns) {
        this.roomCreeps = {};

        for (let spawn of spawns) {
            if (!spawn.spawning) continue
            if (spawn.spawning && Game.creeps[spawn.spawning.name]) this.roomCreeps[Game.creeps[spawn.spawning.name].memory.role] ? this.roomCreeps[Game.creeps[spawn.spawning.name].memory.role]++ : this.roomCreeps[Game.creeps[spawn.spawning.name].memory.role] = 1;
        }

        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.ticksToLive <= creep.body.length * 3) continue;
            if (creep.memory.room != this.room.name) continue;
            this.roomCreeps[creep.memory.role] ? this.roomCreeps[creep.memory.role]++ : this.roomCreeps[creep.memory.role] = 1;
        }
    }

    BuildBody(base, room, max) {
        var arr = [];
        for (var i = 0; i <= (max || Math.floor(50/base.length)); i++) {
            var temp = arr.concat(base);
            if (this.bodyCost(temp) <= room.energyCapacityAvailable && temp.length < 50) {
                arr = arr.concat(base);
            }
        };
        return(arr.sort(function (a, b) {return BODY_CONFIG.indexOf(a) - BODY_CONFIG.indexOf(b);}));
    }

    
    bodyCost (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    }

    spawn(room, spawns, body, name, memory) {
        spawns = Object.values(Game.spawns).filter(spawn => spawn.room == room);
        if (body.length == 0) return ERR_INVALID_ARGS;
        // if unable to spawn
        if (this.bodyCost(body) > room.energyAvailable) return ERR_NOT_ENOUGH_ENERGY;
        
        // console.log(name,"will cost",this.bodyCost(body),"currently have", room.energyAvailable)
        // console.log("body:",body)
        
        for (let spawn of spawns) {
            let attempt = spawn.spawnCreep(body, name, memory);
            // console.log(attempt)
            if (attempt == OK) {
                return OK;
            }
        }
        return ERR_BUSY;
    }
}