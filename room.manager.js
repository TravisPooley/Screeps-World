const roomTower = require('room.tower');
const roomTrading = require('room.trading');
const roomTerminal = require('room.terminal');
const roomFactory = require('room.factory');
const roomLink = require('room.links');
const roomBase = require('room.base');
const roomNuker = require('room.nuker');
const roomCreeps = require('room.creeps');
const roomCreepSpawner = require('room.creepSpawner');
const roomExpansion = require('room.expansion');
const roomCache = require('room.cache');
const scientist = require('role.scientist');

const enemy = require("helper.allyManager");

const cache = require('cache');

module.exports = class roomManager {
    constructor(room) {

        this.room = room;
        this.storage = room.storage;
        if (this.room.controller) {
            this.room.memory.controllerLevel = this.room.controller.level || null;
        }

        room.memory.lastScouted = Game.time;

        // console.log(Game.rooms["W3N1"].controller.owner.username)
        
        this.spawns = Object.values(Game.spawns).filter(spawn => spawn.room == room);
        this.spawner = new roomCreepSpawner(room);
        // this.constructions = new Constructions(room);
        // this.defense = new Defense(room);
        this.factory = new roomFactory(room);
        // this.intervals = new Intervals();
        this.links = new roomLink(room);
        // this.labs = new roomLabs(room);
        this.trading = new roomTrading(room);
        this.terminal = new roomTerminal(room);

       
        roomCache.source(room);
        roomCache.extension(room);
        roomCache.factory(room);
        roomCache.ownedRooms(room);
        roomCache.owner(room);
        roomCache.labs(room);
        roomCache.links(room);
        roomCache.mineral(room);

        cache.init.sources(room);
        cache.init.containers(room);
        cache.init.storage(room);
        cache.init.exits(room);
        cache.init.locations(room);

        if (this.spawns.length > 0) {
            this.roomNumber = Object.values(Memory.global.communes).indexOf(room.name);
            this.lastTerminal = Game.time;
            this.lastBase = Game.time;
            this.lastGeneral = Game.time;
            // this.lastExtraCreep = Game.time+2;
            this.lastExtraCreep = Game.time+75;
// this.lastExtraCreep = Game.time+2
        }

        this.roomCreeps = new roomCreeps(room);
        this.roomDefcon = 5;

        console.log("init",this.room.name)
    }

    run(room) {



        if (Game.time % 1200 == 0) {
            cache.update.containers(room);
            // cache.update.spawn(room);
            // cache.update.enemies(room);
            // cache.update.controllerLink(room);
            cache.update.sourceContainers(room);
            cache.update.extractor(room);
        }
        // console.log(room, Memory.global.communes.indexOf(room.name) != -1)
        if (Memory.global.communes.indexOf(room.name) != -1) {
            let spawns = Object.values(Game.spawns).filter(spawn => spawn.room == room);
            let availableSpawns = spawns.filter(spawn => spawn.spawning == null);
            if (availableSpawns.length > 0) this.spawner.run(this.roomDefcon, spawns, room);
            
            if (Game.time > this.lastExtraCreep) {
                console.log("DEBUG:","NEW TEST")
                this.lastExtraCreep = Game.time+75;
                // this.lastExtraCreep = Game.time+10
                // if (this.roomNumber != 0) 
                    
                    if (!room.memory.reaction) {
                        console.log(room.name, "reaction:",scientist.getReaction(room, room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_LAB)}})))
                    }
            }

            // if (Game.time % 10 == 0) this.remotes(room)

            if ((Game.time - this.lastGeneral) - (this.roomNumber*8) > 500) {
                // console.log('DEBUG:', "EXPANSION AND NUKE RUNNING");
                this.lastGeneral = Game.time;
                this.general(room);
                
            }

            if ((Game.time - this.lastBase) - this.roomNumber > 100) {
                console.log('DEBUG:', "BASE CODE RUNNING",Game.time);
                this.lastBase = Game.time;
                roomBase.manageBase(room);
                
            }

            let hostiles = enemy.findHostiles(room);

            if (hostiles.length == 0 && ((Game.time - this.lastTerminal) - (this.roomNumber*9) > 50)) {
            // if ((Game.time - this.lastTerminal) - (this.roomNumber*9) > 200) {
                // console.log('DEBUG:', "TERMINAL RUNNING ",room.name);
                this.lastTerminal = Game.time;
                if (room.terminal) this.terminal.run(room, room.terminal);
                
            }
            
            if (hostiles.length != 0) {
                // if only small raid
                if (hostiles.length <= 2) {
                    this.roomDefcon = 4;
                }
                else {
                    this.roomDefcon = 3;
                }

                if (room.controller.level > 4) {
                    if (enemy.findHostilesInRange(Game.flags[room.name].pos, 5).length > 0) {
                        this.roomDefcon = 2;
                        
                        if (room.controller.safeModeAvailable && !room.controller.safeMode) {
                            room.controller.activateSafeMode();
                        }
                        
                    }
                }
            }
            else if (this.roomDefcon != 5){
                this.roomDefcon = 5;
            }

            
            
            roomTower.run(room, room.storage, room.controller.level, hostiles)
            

            // this.trading.runTerminal();



            // this.labs.run();
            
            this.links.fullfillRequests();

            if (Game.time % 500 == 0) {
                this.mineralActive();
            }

            // this.visuals()

    
            // this.factory.needs();
            // this.factory.run();
        }

        
        
        // console.log(this.canSpawn())
        // this.observer.performObservation();
        // this.links.fullfillRequests();
        // this.links.replaceNextContainerByLink();
        // this.labs.selectPrioritizedBoosts();

        // this.spawns.renderOverlay();

        // this.renderModeOverlay();
    }

    general(room) {
        console.log("GENERAL",this.room.name)
        if (roomNuker.run(room) == "spawn") this.roomCreeps.manageNukeOperator(this.spawns);
        if (roomExpansion.run(room) == "spawn") this.roomCreeps.manageClaimer(this.spawns);
        this.roomCreeps.manageExpansionBuilder();
        this.roomCreeps.manageRampartUpgraders(this.spawns);
        // if (this.roomNumber == 0) 
    }

    remotes(room) {
        let possibleRemotes = room.memory.possibleRemotes;
        if (!possibleRemotes) return
        // sort possible remotes by distance
        Object.values(possibleRemotes).sort((a,b) => {
            console.log("a",JSON.stringify(a))
            console.log("b",JSON.stringify(b))
        });

        // console.log(JSON.stringify(possibleRemotes))
        // for (let possible in possibleRemotes) {
        //     console.log(possible)
        //     console.log(JSON.stringify(possibleRemotes[possible]))
        // }
    }

    // spawn(parts, memory) {
    //     return this.spawns.spawn(parts, memory)
    // }

    get name() {
        return(this.room.name);
    }

    get test() {
        return(this.room.name+"test")
    }

    canSpawn() {
        return (this.spawns.filter(spawn => spawn.spawning == null));
    }

    // renderModeOverlay() {
    //     RoomUI.forRoom(this.room).addRoomCaption(`Mode: ${this.mode}`);
    // }

    mineralActive() {   
        var minerals = this.room.find(FIND_MINERALS); 
        var mineralsList = [];
        var mineralTypes = [];
        for (var mineral in minerals) {
            mineralsList.push(minerals[mineral].id);
            mineralTypes.push(minerals[mineral].mineralType);
            if (minerals[mineral].mineralAmount > 0) {
                this.room.memory.mineralActive = true;
            }
            else {
                this.room.memory.mineralActive = false;
            }
        }
        this.room.memory["minerals"] = mineralsList;
        this.room.memory["mineralsTypes"] = mineralTypes;
    }
   

    visuals() {
        function panel(x, y, name, bars) {
            var width = 9;
            var height = bars.length+1;
            new RoomVisual(this.room.name).rect(x-0.5, y-0.5, width, 1, {fill: '#353535', stroke: 'transparent'});
            
            new RoomVisual(this.room.name).text(name, x-0.25, y+0.2, {color: '#9e9e9e', font: 0.5, align: "left"}); 
            
            new RoomVisual(this.room.name).rect(x-0.5, y-0.5, width, height, {fill: 'transparent', stroke: '#747474'});
            
            for(var bar in bars) {
                new RoomVisual(this.room.name).text(bars[bar][0], x-0.25, y+1.15+(bar*1), {color: '#747474', font: 0.5, align: "left"}); 
                
                // console.log(bars[bar][1]/bars[bar][2]*100)
                
                
                new RoomVisual(this.room.name).text((bars[bar][1]/bars[bar][2]*100).toFixed(0), x+width-1.5, y+1.075+(bar*1), {color: '#747474', font: 0.25, align: "left"}); 
                
                new RoomVisual(this.room.name).rect((x+width-1.5)-4, y+0.75+(bar*1), 4.5*(bars[bar][1]/bars[bar][2]*100)/100, 0.5, {fill: '#353535', stroke: 'transparent'});
                
                new RoomVisual(this.room.name).rect((x+width-1.5)-4, y+0.75+(bar*1), 4.5, 0.5, {fill: 'transparent', stroke: '#747474', strokeWidth: 0.02});
            }
            
        }
        
        panel(12, 3, "Test Pannel One", [["Test Bar", 20, 50], ["Another Bar", 10, 100], ["More Bar", 99, 100]])

        panel(12, 8, "Test Pannel Two", [["Cool Bar", 17, 23], ["Last Bar", 45, 100]])
    }

    toString() {
        return ("<span>[Room Manager "+'<a href="#!/room/'+Game.shard.name+'/'+this.room.name+'">'+this.room.name+'</a>]</span>');
    }
}