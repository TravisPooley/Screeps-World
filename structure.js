var base = {
    "storage"           : [{x:-1, y:-1}],
    "link"              : [{x:-1,y:-2}],
    "extension"         : [{x:-1, y:-4}, {x:-2, y:-4}, {x:-3, y:-3}, {x:-3, y:-2}, {x:-3, y:0}, {x:-3, y:1}, {x:-2, y:2}, {x:-1, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:-2}, {x:3, y:0}, {x:3, y:1}, {x:1, y:-5}, {x:-1, y:-5}, {x:-2, y:-5}, {x:-3, y:-5}, {x:-4, y:-4}, {x:-4, y:-3}, {x:-4, y:-2}, {x:-4, y:0}, {x:-4, y:1}, {x:-4, y:2}, {x:-3, y:3}, {x:-2, y:3}, {x:-1, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:2}, {x:4, y:1}, {x:4, y:0}, {x:4, y:-2}, {x:5, y:-2}, {x:5, y:0}, {x:5, y:1}, {x:5, y:2}, {x:5, y:3}, {x:-4, y:4}, {x:-3, y:4}, {x:-2, y:4}, {x:-1, y:4}, {x:1, y:4}, {x:2, y:4}, {x:3, y:4}, {x:4, y:4}, {x:-5, y:3}, {x:-5, y:2}, {x:-5, y:1}, {x:-5, y:0}, {x:-5, y:-2}, {x:-5, y:-3}, {x:-5, y:-4}, {x:-5, y:-5}, {x:-4, y:-6}, {x:-3, y:-6}, {x:-2, y:-6}, {x:-1, y:-6}, {x:1, y:-6}],
    "tower"             : [{x:-2,y:-1},{x:2,y:-1}, {x:0,y:1}, {x:0,y:-3}, {x:-6,y:-1}, {x:6,y:-1} ],
    "constructedWall"   : [{x:-6,y:4},{x:-5,y:5},{x:5,y:5},{x:6,y:4},{x:6,y:-6},{x:5,y:-7}, {x:-6,y:-6},{x:-5,y:-7}, {x:-7,y:-5},{x:-7,y:-6},{x:-4,y:-8}, {x:4,y:-8},{x:-5,y:-8}, {x:5,y:-8},{x:-3,y:6},{x:-4,y:6}, {x:-2,y:6},{x:7,y:4},{x:-7,y:4},{x:5,y:6},{x:-5,y:6}, {x:-1,y:6},  {x:1,y:6}, {x:2,y:6}, {x:3,y:6}, {x:4,y:6}, {x:7,y:0}, {x:7,y:1}, {x:7,y:2}, {x:7,y:3}, {x:7,y:-2}, {x:7,y:-3}, {x:7,y:-4}, {x:7,y:-5},{x:7,y:-6},{x:-3,y:-8}, {x:-2,y:-8}, {x:-1,y:-8}, {x:1,y:-8}, {x:2,y:-8}, {x:3,y:-8}, {x:-7,y:-2}, {x:-7,y:-3}, {x:-7,y:-4}, {x:-7,y:0}, {x:-7,y:1}, {x:-7,y:2}, {x:-7,y:3}],
    "road"              : [{x:-7,y:-1}, {x:-6,y:-5}, {x:-6,y:-4}, {x:-6,y:-3}, {x:-6,y:-2}, {x:-6,y:0}, {x:-6,y:1}, {x:-6,y:2}, {x:-6,y:3}, {x:-5,y:-6}, {x:-5,y:-1}, {x:-5,y:4}, {x:-4,y:-7}, {x:-4,y:-5}, {x:-4,y:-1}, {x:-4,y:3}, {x:-4,y:5},{x:4,y:5}, {x:-3,y:-7}, {x:-3,y:-4}, {x:-3,y:-1}, {x:-3,y:2}, {x:-3,y:5}, {x:-2,y:-7}, {x:-2,y:-3}, {x:-2,y:-2}, {x:-2,y:0}, {x:-2,y:1}, {x:-2,y:5}, {x:-1,y:-7}, {x:-1,y:-3}, {x:-1,y:1}, {x:-1,y:5}, {x:0,y:-8}, {x:0,y:-6}, {x:0,y:-5}, {x:0,y:-4}, {x:0,y:2}, {x:0,y:3}, {x:0,y:4}, {x:0,y:6}, {x:1,y:-7}, {x:1,y:-3}, {x:1,y:1}, {x:1,y:5}, {x:2,y:-7}, {x:2,y:-3}, {x:2,y:-2}, {x:2,y:0}, {x:2,y:1}, {x:2,y:5}, {x:3,y:-7}, {x:3,y:-4}, {x:3,y:-1}, {x:3,y:2}, {x:3,y:5}, {x:4,y:-7}, {x:4,y:-5}, {x:4,y:-1}, {x:4,y:3}, {x:4,y:3}, {x:5,y:-6}, {x:5,y:-1}, {x:5,y:4}, {x:6,y:-5}, {x:6,y:-4}, {x:6,y:-3}, {x:6,y:-2}, {x:6,y:0}, {x:6,y:1}, {x:6,y:2}, {x:6,y:3}, {x:7,y:-1}],
    "rampart"           : [{x:0,y:0},{x:-7,y:-1},{x:6,y:5},{x:-6,y:5},{x:-6,y:-7},{x:6,y:-7},{x:0,y:-8},{x:0,y:6},{x:7,y:-1}],
    //"container"         : [{x:0,y:5}, {x:0,y:-7}],
    "lab"               : [{x:4,y:-4},{x:3,y:-5}, {x:3,y:-3},{x:4,y:-3},{x:5,y:-4}, {x:5,y:-5}, {x:2,y:-4}, {x:2,y:-5}, {x:3,y:-6}, {x:4,y:-6}],
    "nuker"             : [{x:2,y:-6}],
    "observer"          : [{x:5,y:-3}],
    "factory"           : [{x:1, y:-2}],
    "terminal"          : [{x:1,y:-1}],
    "spawn"             : [{x:-1, y:0}, {x:1, y:0}],
    "power spawn"       : [{x:0,y:-2}]
}

base["rampart"] = base["rampart"].concat(base["spawn"]);
base["rampart"] = base["rampart"].concat(base["storage"]);
base["rampart"] = base["rampart"].concat(base["terminal"]);
base["rampart"] = base["rampart"].concat(base["tower"]);

// {x:-7,y:6},{x:-6,y:7}, {x:6,y:7},{x:7,y:6},
module.exports = {
    newBase(room, spawn) {
        room.createConstructionSite(spawn.pos.x, spawn.pos.y, "rampart");

        for (var structure in base) {
            for (var pos in base[structure]) {
                room.createConstructionSite(spawn.pos.x+base[structure][pos]["x"], spawn.pos.y+base[structure][pos]["y"], structure);
            }
        }
    },

    exitWalls(room, spawn) {

        // var exits = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];
        // var t = [{"x":0, "y":-2}, {"x":-2, "y":0}, {"x":0, "y":2}, {"x":2, "y":0}]
        // for (var exitType = 0; exitType < exits.length; exitType++) {
        //     var ramp = spawn.pos.findClosestByPath(exits[exitType]);
        //     if (ramp) {
        //         new RoomVisual(room.name).text("🧱", (ramp.x+t[exitType]["x"]), (ramp.y+t[exitType]["y"])+0.25, {color: 'green', font: 0.8});    
        //     }
        // }




        var exits = room.find(FIND_EXIT);
        exits.forEach(exit => {
            for (var x = exit["x"]-2; x<=exit["x"]+2; x++) {
                for (var y = exit["y"]-2; y<=exit["y"]+2; y++) {
                    // if ((y >= 47 || y <= 2 && x%2==0) || (x >= 47 || x <= 2 && y%2==0)) {
                    
                    if (y < 50 && x < 50 && y >= 0 && x>=0) {
                        if (y%2==0 && x%2==0 || x%2!=0 && y%2!=0) {
                            new RoomVisual(room.name).text("⛔️", (x), (y)+0.25, {color: 'green', font: 0.8}); 
                            
                                // let result = room.lookForAt(LOOK_STRUCTURES, x, y);
                                // console.log(result[0] != undefined)
                                // if (result[0] != undefined && result[0].structureType && result[0].structureType != STRUCTURE_RAMPART && result[0].structureType != STRUCTURE_ROAD) {
                                //     console.log('e')
                                //     result[0].destroy();
                                // }
                                
                                room.createConstructionSite(x, y, STRUCTURE_RAMPART);

                        }
                        else {
                            new RoomVisual(room.name).text("🧱", (x), (y)+0.25, {color: 'green', font: 0.8}); 
                            let result = room.lookForAt(LOOK_STRUCTURES, x, y);
                            if (result[0] != undefined && result[0].structureType && result[0].structureType != STRUCTURE_WALL && [0].structureType != STRUCTURE_ROAD) {
                                result[0].destroy();
                            }
                            room.createConstructionSite(x, y, STRUCTURE_WALL);
                        }   
                    }
                    
                }
            }
        });
    },

    baseVisual(pos, room) {
        base["constructedWall"].forEach(wall => {
            // spawn.room.visual.rect((spawn.pos.x+wall["x"])-0.5, (spawn.pos.y+wall["y"])-0.5, 1, 1, {fill: 'transparent', stroke: '#f00'});
            new RoomVisual(room.name).text("🧱", (pos.x+wall["x"]), (pos.y+wall["y"])+0.25, {color: 'green', font: 0.8}); 
        });
        base["road"].forEach(road => {
            // spawn.room.visual.rect((spawn.pos.x+wall["x"])-0.5, (spawn.pos.y+wall["y"])-0.5, 1, 1, {fill: 'transparent', stroke: '#f00'});
            new RoomVisual(room.name).text("🚗", (pos.x+road["x"]), (pos.y+road["y"])+0.25, {color: 'green', font: 0.8}); 
        });
        base["rampart"].forEach(road => {
            // spawn.room.visual.rect((spawn.pos.x+wall["x"])-0.5, (spawn.pos.y+wall["y"])-0.5, 1, 1, {fill: 'transparent', stroke: '#f00'});
            new RoomVisual(room.name).text("⛔️", (pos.x+road["x"]), (pos.y+road["y"])+0.25, {color: 'green', font: 0.8}); 
        });
    },


    buildRoad(room, spawn) {
        room.memory.sources.concat(room.controller.id).concat(room.memory.minerals).forEach(source => {
            var path = room.findPath(Game.getObjectById(source).pos, spawn.pos, { ignoreCreeps: true });
            path.forEach(location => {
                var pos = new RoomPosition(location["x"], location["y"], room.name);
                if (!pos.inRangeTo(spawn.pos.x, (spawn.pos.y-1), 5)) {
                    room.createConstructionSite(location["x"], location["y"], STRUCTURE_ROAD);
                    // new RoomVisual(room.name).text("🧱", (location["x"]), (location["y"])+0.25, {color: 'green', font: 0.8}); 
                }
            });
        });
    },


    buildContainers(room) {
        if (room.memory.locations.containers.length == 0) {
            var soureces = room.find(FIND_SOURCES);
            var spawnStructure = room.find(FIND_MY_SPAWNS);
            if (soureces) {
                for(var source in soureces) {
                    var path = room.findPath(soureces[source].pos, spawnStructure[0].pos, {
                        ignoreDestructibleStructures: true, ignoreCreeps: true,
                    });
                    room.memory["locations"]["containers"].push(new RoomPosition(path[0].x, path[0].y, room.name))
                    room.createConstructionSite(path[0].x, path[0].y, STRUCTURE_CONTAINER);
                }
            }
        }
        else {
            if (room.memory["locations"] && room.memory["locations"]["containers"]) {
                room.memory["locations"]["containers"].forEach(container => {
                    room.createConstructionSite(container.x, container.y, STRUCTURE_CONTAINER);
                });
            }
        }
    },
    buildLink(room, spawn) {
        
        room.memory["locations"]["containers"].forEach(container => {
        
            var area = room.lookAtArea(container["y"]-1,container["x"]-1,container["y"]+1,container["x"]+1,true)
            var possible = []
            area.forEach(location => {
                
                if (location.type == "terrain" && location.terrain != "wall" && location.type == "terrain") {
                    var rangeTo = spawn.pos.getRangeTo(location["x"],location["y"]);
                    possible.push([rangeTo,new RoomPosition(location["x"],location["y"], container["roomName"])]);
                }
            });

            possible.sort((a,b) => a[0] - b[0]);

            for (location in possible) {
                if (room.lookAt(possible[location][1]).length == 1 && room.memory.sourceLinks) {
                    new RoomVisual(room.name).text("🥛",possible[location][1]["x"], (possible[location][1]["y"]+0.25), {color: 'green', font: 0.8});
                    break;
                }
            }
        });
        
    },
    buildRoadsSpawn(room) {
        var soureces = room.find(FIND_SOURCES_ACTIVE);
        var spawnStructure = room.find(FIND_MY_SPAWNS);
        spawnStructure = spawnStructure[0];
        soureces.sort((a,b) => spawnStructure.pos.getRangeTo(b) - spawnStructure.pos.getRangeTo(a));
        for(var source in soureces) {
            var path = soureces[source].room.findPath(soureces[source].pos, spawnStructure.pos);
            path.forEach((p,index) => {
                if (index != path.length-1 && index!=0) {
                    var pos = new RoomPosition(p.x,  p.y, room.name);
                    if (!pos.inRangeTo(spawnStructure.pos.x, (spawnStructure.pos.y-1), 8)) {
                        soureces[source].room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD);
                    }
                }
            });
        }
    },
    buildRoadsController(room) {
        if (room.controller) {
            var controllerStucture = room.controller      
            var spawnStructure = room.find(FIND_MY_SPAWNS);
            spawnStructure = spawnStructure[0];
            var path = room.findPath(controllerStucture.pos, spawnStructure.pos);
            path.forEach((p,index) => {
                if (index != path.length-1 && index>2) {
                    var pos = new RoomPosition(p.x,  p.y, room.name);
                    if (!pos.inRangeTo(spawnStructure.pos.x, (spawnStructure.pos.y-1), 8)) {
                        room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD);
                    }
                }
            });
        }
    },
    buildRoadsExits(room) {
        
    },
    removeAllConstructionSites(room) {
        room.find(FIND_CONSTRUCTION_SITES).forEach(c => c.remove());
    }
}