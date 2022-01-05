
module.exports.init = {
    sources(room) {
        if (room.memory.sources == null) {
            var sources = room.find(FIND_SOURCES);
            var sourceList = [];
            for (var source in sources) {
                sourceList.push(sources[source].id);
            }
            room.memory["sources"] = sourceList;
            room.memory.sourceDistance = {};
        }
    },
    mineral(room) {
        if (room.memory.minerals == null) {
            var minerals = room.find(FIND_MINERALS);
            var mineralsList = [];
            var mineralTypes = [];
            for (var mineral in minerals) {
                mineralsList.push(minerals[mineral].id);
                mineralTypes.push(minerals[mineral].mineralType);
            }
            room.memory["minerals"] = mineralsList;
            room.memory["mineralsTypes"] = mineralTypes;
        }
    },
    containers(room) {
        if (room.memory.containers == null) {
            var containers = room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER);
            var containerList = [];
            containers.forEach(container => {
                containerList.push(container.id);
            });
            room.memory["containers"] = containerList;
        }
        if (room.memory.sourceContainers == undefined) {
            room.memory.sourceContainers = {};
        }
    },
    storage(room) {
        if (room.memory.storage == null) {
            var storage = room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_STORAGE);
            if (storage > 0) {
                room.memory["storage"] = storage[0].id;
            } else { room.memory["storage"] = []; }
        }
    },
    spawn(room) {
        if (room.memory.spawn == null) {
            room.memory["spawn"] = room.find(FIND_MY_SPAWNS).filter((s) => s.structureType == STRUCTURE_SPAWN);
        }
    },
    exits(room) {
        if (!room.memory.exits) {
            if (Game.map) {
                var exits = Object.values(Game.map.describeExits(room.name));
                if (exits) {
                    room.memory["exits"] = exits;
                }
                else {
                    room.memory["exits"] = null;
                }
            }
            else {
                room.memory["exits"] = null;
            }
            
        }
    },
    locations(room) {
        if (room.memory.locations == null) {
            room.memory["locations"] = {}
            room.memory["locations"]["roads"] = [];
            room.memory["locations"]["containers"] = [];
            room.memory["locations"]["links"] = [];
        }
    },
    links(room) {
        if (room.memory.sourceLinks == undefined) {
            room.memory.sourceLinks = {};
        }
    },
    factory(room) {
        if (room.memory.factory == null) {
            var factory = room.find(FIND_MY_STRUCTURES).filter((s) => s.structureType == STRUCTURE_FACTORY);
            if (factory[0]) {
                room.memory["factory"] = factory[0].id;
            }
        }
    }
    
}
module.exports.update = {
    lab(room, spawn) {
        var labs = [{x:4,y:-4},{x:3,y:-5}, {x:3,y:-3},{x:4,y:-3},{x:5,y:-4}, {x:5,y:-5}, {x:2,y:-4}, {x:2,y:-5}, {x:3,y:-6}, {x:4,y:-6}];
        room.memory["labs"] = [];

        for (let i = 0; i < labs.length; i++) {
            var temp = room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_LAB && a.pos.x == spawn.pos.x+labs[i]["x"] && a.pos.y == spawn.pos.y+labs[i]["y"])[0];
            if (temp) {
                room.memory["labs"][i] = temp["id"];
            }
            else {
                room.memory["labs"][i] = undefined;
            }
        }
    },
    extractor(room) {
        var extractor = room.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_EXTRACTOR);
        if (extractor[0]) {
            room.memory.extractor = extractor[0].id;
        }
        else {
            room.memory.extractor = undefined;
        }
        
    },
    containers(room) {
        var containers = room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_CONTAINER);
        var c = [];

        containers.forEach(container => {
            c.push(container.id);
        });
        room.memory["containers"] = c;
    },
    sourceContainers(room) {
        var sources = room.find(FIND_SOURCES_ACTIVE);
        room.memory["sourceContainers"] = {}
        sources.forEach(source => {
            var inRange = source.pos.findInRange(FIND_STRUCTURES, 2).filter(a => a.structureType == STRUCTURE_CONTAINER);
            if (inRange[0]) {
                room.memory["sourceContainers"][source.id] = inRange[0].id
            }
        });
    },
    storage(room) {
        var storage = room.find(FIND_STRUCTURES).filter(a => a.structureType == STRUCTURE_STORAGE);
        if (storage[0]) {
            room.memory["storage"] = storage[0].id;
        }
        else {
            room.memory["storage"] = [];
        }
    },
    spawn(room) {
        room.memory["spawn"] = room.find(FIND_MY_SPAWNS)[0];
    },
    enemies(room) {
        room.memory["enemies"] = room.find(FIND_HOSTILE_CREEPS)+room.find(FIND_HOSTILE_STRUCTURES);
    },
    mainLink(room) {
        if (room.memory.storage.length > 0) {
            var link =  Game.getObjectById(room.memory.storage).pos.findInRange(FIND_MY_STRUCTURES, 3).filter(a => a.structureType == STRUCTURE_LINK)[0];
            if (link) {
                room.memory["mainLink"] = link.id;
            }
        }
    },

    // fix that ^
    sourceLink(room) {
        var sources = room.find(FIND_SOURCES_ACTIVE);
        room.memory["sourceLinks"] = {}
        sources.forEach(source => {
            var inRange = source.pos.findInRange(FIND_MY_STRUCTURES, 3).filter(a => a.structureType == STRUCTURE_LINK);
            if (inRange[0]) {
                room.memory["sourceLinks"][source.id] = inRange[0].id
            }
        });
    },
    controllerLink(room) {
        if (room.controller) {
            var link = room.controller.pos.findInRange(FIND_MY_STRUCTURES, 5).filter(a => a.structureType == STRUCTURE_LINK);
            if (link.length > 0) {
                room.memory["controllerLink"] = link[0].id
            }
        }
    }
}