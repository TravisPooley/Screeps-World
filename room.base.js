const base = {
    "spawn": [{ x: 0, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 1 }],
    "extension": [{ x: -1, y: -3 }, { x: -2, y: -3 }, { x: -3, y: -2 }, { x: -3, y: -1 }, { x: -3, y: 1 }, { x: -2, y: 2 }, { x: -1, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 0 }, { x: 3, y: 2 }, { x: 2, y: 3 }, { x: -2, y: 3 }, { x: -3, y: 2 }, { x: -4, y: 0 }, { x: 5, y: -1 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 4 }, { x: 0, y: 4 }, { x: -4, y: -2 }, { x: -4, y: -3 }, { x: -3, y: -4 }, { x: -2, y: -4 }, { x: 1, y: -5 }, { x: -1, y: -5 }, { x: -3, y: -5 }, { x: -4, y: -5 }, { x: -5, y: -4 }, { x: -5, y: -3 }, { x: -5, y: -1 }, { x: -5, y: 0 }, { x: -5, y: 1 }, { x: -4, y: 2 }, { x: -3, y: 3 }, { x: -2, y: 4 }, { x: -5, y: 3 }, { x: -5, y: 4 }, { x: -4, y: 5 }, { x: -4, y: 4 }, { x: -3, y: 5 }, { x: -1, y: 5 }, { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 6, y: -2 }, { x: 6, y: 2 }, { x: 2, y: 6 }, { x: -2, y: 6 }, { x: -6, y: 2 }, { x: -6, y: -2 }, { x: -2, y: -6 }, { x: 2, y: -6 },],
    "storage": [{ x: -1, y: -1 }],
    "tower": [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 0, y: -2 }, { x: 0, y: 2 }, { x: 2, y: 0 }],
    "link": [{ x: 0, y: -1 }],
    "rampart": [{ x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 6 }, { x: 0, y: 6 }, { x: -1, y: 6 }, { x: -2, y: 6 }, { x: -3, y: 6 }, { x: -4, y: 6 }, { x: -5, y: 5 }, { x: -6, y: 4 }, { x: -6, y: 3 }, { x: -6, y: 2 }, { x: -6, y: 1 }, { x: -6, y: 0 }, { x: -6, y: -1 }, { x: -6, y: -2 }, { x: -6, y: -3 }, { x: -6, y: -4 }, { x: -5, y: -5 }, { x: -4, y: -6 }, { x: -3, y: -6 }, { x: -2, y: -6 }, { x: -1, y: -6 }, { x: 0, y: -6 }, { x: 1, y: -6 }, { x: 2, y: -6 }, { x: 3, y: -6 }, { x: 4, y: -6 }, { x: 5, y: -5 }, { x: 6, y: -4 }, { x: 6, y: -3 }, { x: 6, y: -2 }, { x: 6, y: -1 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 5, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 4 }, { x: -4, y: -5 }, { x: -5, y: -4 }, { x: 4, y: -5 }, { x: 5, y: -4 }, { x: -4, y: 5 }, { x: -5, y: 4 }, { x: -2, y: 5 }, { x: -1, y: 4 }, { x: 2, y: 5 }, { x: 1, y: 4 }],
    "terminal": [{ x: 1, y: -1 }],
    "factory": [{ x: 1, y: -3 }],
    "nuker": [{ x: 3, y: -1 }],
    "lab": [{ x: 4, y: -3 }, { x: 3, y: -4 }, { x: 4, y: -2 }, { x: 3, y: -2 }, { x: 2, y: -3 }, { x: 2, y: -4 }, { x: 3, y: -5 }, { x: 4, y: -5 }, { x: 5, y: -3 }, { x: 5, y: -4 },],
    "road": [{ x: 2, y: 1 }, { x: 3, y: 0 }, { x: 2, y: -1 }, { x: 1, y: -2 }, { x: 0, y: -3 }, { x: -1, y: -2 }, { x: -2, y: -1 }, { x: -3, y: 0 }, { x: -2, y: 1 }, { x: -1, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 2 }, { x: 4, y: -1 }, { x: 5, y: -2 }, { x: 6, y: -3 }, { x: 6, y: -4 }, { x: 5, y: -5 }, { x: 4, y: -4 }, { x: 3, y: -3 }, { x: 2, y: -2 }, { x: 1, y: -4 }, { x: 2, y: -5 }, { x: 3, y: -6 }, { x: 4, y: -6 }, { x: 1, y: -6 }, { x: 0, y: -6 }, { x: -1, y: -6 }, { x: -2, y: -5 }, { x: -1, y: -4 }, { x: -3, y: -6 }, { x: -4, y: -6 }, { x: -5, y: -5 }, { x: -6, y: -4 }, { x: -6, y: -3 }, { x: -5, y: -2 }, { x: -4, y: -1 }, { x: -6, y: -1 }, { x: -6, y: 0 }, { x: -6, y: 1 }, { x: -5, y: 2 }, { x: -4, y: 1 }, { x: -6, y: 3 }, { x: -6, y: 4 }, { x: -5, y: 5 }, { x: -4, y: 6 }, { x: -3, y: 6 }, { x: -2, y: 5 }, { x: -1, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 5 }, { x: -1, y: 6 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 1 }, { x: 5, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 1 }, { x: 6, y: 0 }, { x: 6, y: -1 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 5, y: 5 }, { x: -3, y: 4 }, { x: -4, y: 3 }, { x: -3, y: -3 }, { x: -2, y: -2 }, { x: -4, y: -4 }],
    "power spawn": [{ x: 0, y: -4 }],
    "observer": [{ x: 0, y: -5 }],
}

const PRIMARY = ["spawn", "extension",  "storage", "tower", "link"];
const SECONDARY = ["rampart", "terminal", "lab"];
const TERTIARY = ["observer", "power spawn", "nuker", "factory", "road"];
// ["extension", "link", "storage", "tower", "terminal", "factory", "nuker", "lab", "power spawn", "observer"];


const baseVisual = {
    "spawn": "🏠",
    "factory": "🏭",
    "link": "t",
    "extension": "🟡",
    "nuker": "☢️",
    "link": "🔗",
    "road": "🛣️",
    "observer": "👀",
    "storage": "📦",
    "rampart": "🛑",
    "terminal": "💱",
    "lab": "⚗️",
    "tower": "🔫",
    "power spawn": "⚡"
}

const MAX_CONSTRUCTION_SITES = 10;

module.exports = {

    // make class make constructor store the amount of construction sites in room

    manageBase(room) {
        let flag = Game.flags[room.name]

        if (!flag) {
            console.log(room.name,"NO FLAG")
            return
        }

        if (!Game.flags[room.name + " TRANSFER IDLE"]) {
            Game.rooms[room.name].createFlag(flag.pos.x - 2, flag.pos.y - 2, room.name + " TRANSFER IDLE", COLOR_GREY, COLOR_GREY);
        }

        let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        let constructionSitesCount = constructionSites.length;
        // console.log(room.name + " construction sites: " + constructionSitesCount);

        // this.buildContainer(room, room.controller, flag.pos, constructionSitesCount)
        constructionSitesCount = this.buildPrimary(room, flag.pos, constructionSitesCount);
        if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return;
        constructionSitesCount = this.buildSecondary(room, flag.pos, constructionSitesCount);
        if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return;
        constructionSitesCount = this.buildTertiary(room, flag.pos, constructionSitesCount);
        if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return;


        this.newBase(room, flag.pos);

        if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return;
        this.buildRoads(room);



        // this.visual(room, flag.pos);

        // this.buildRoad(room, flag.pos)


        // this.controllerShield(room, flag.pos);


        if (room.controller.level < 6) return;

        room.find(FIND_MINERALS)[0].pos.createConstructionSite(STRUCTURE_EXTRACTOR);

    },

    build(room, center, locations, structureType, constructionSitesCount) {
        for (location of locations) {
            if (room.createConstructionSite(center.x + base[location]["x"], center.y + base[location]["y"], structureType) == OK) constructionSitesCount++;
            if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return true;
        }
        return false;
    },

    buildPrimary(room, center, constructionSitesCount) {

        for (var structure of PRIMARY) {
            for (var position in base[structure]) {
                if (room.createConstructionSite(center.x + base[structure][position]["x"], center.y + base[structure][position]["y"], structure) == OK) constructionSitesCount++;
                if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return constructionSitesCount;
            }
        }
        return constructionSitesCount;
    },

    buildSecondary(room, center, constructionSitesCount) {
        for (var structure of SECONDARY) {
            for (var position in base[structure]) {
                if (room.createConstructionSite(center.x + base[structure][position]["x"], center.y + base[structure][position]["y"], structure) == OK) constructionSitesCount++;
                if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return constructionSitesCount;
            }
        }
        return constructionSitesCount;
    },

    buildTertiary(room, center, constructionSitesCount) {
        for (var structure of TERTIARY) {
            for (var position in base[structure]) {
                if (room.createConstructionSite(center.x + base[structure][position]["x"], center.y + base[structure][position]["y"], structure) == OK) constructionSitesCount++;
                if (constructionSitesCount >= MAX_CONSTRUCTION_SITES) return constructionSitesCount;
            }
        }
        return constructionSitesCount;
    },

    buildRoads(room) {
        locations = room.find(FIND_SOURCES)
        locations.push(room.controller);

        if (room.controller.level > 5) locations = locations.concat(room.find(FIND_MINERALS));

        for (location of locations) {
            this.buildRoadTo(room, location, true);
        }
    },

    buildContainer(room, location, center, constructionSitesCount) {
        console.log(location)
        for (let x = (location.pos.x - 1) - center.x; x <= (location.pos.x + 1) - center.x; x++) {
            for (let y = (location.pos.y - 1) - center.y; y <= (location.pos.y + 1) - center.y; y++) {
                let distance = location.pos.findPathTo(x, y,room.name).length;
                new RoomVisual().text(distance, x, y, {align: 'left'}); 
                
                // if (room.createConstructionSite(x, y, STRUCTURE_CONTAINER) == OK) constructionSitesCount++;
            }
        }
    },

    buildRoadTo(room, location, doRoads = false) {

        // if ((MAX_CONSTRUCTION_SITES - Object.keys(Game.constructionSites).length) < 10) return
        let placedSites = 0;
        let origin = Game.flags[room.name];

        goal = { pos: origin.pos, range: 7 };
        var path = PathFinder.search(location.pos, goal, {
            plainCost: 4,
            swampCost: 24,
            // maxRooms: 1,

            roomCallback: function (roomName) {

                let cm

                cm = new PathFinder.CostMatrix

                let roadConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
                    filter: s => s.structureType == STRUCTURE_ROAD
                })

                for (let roadSite of roadConstructionSites) {

                    cm.set(roadSite.pos.x, roadSite.pos.y, 1)
                }

                let roads = room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_ROAD
                })

                for (let road of roads) {

                    cm.set(road.pos.x, road.pos.y, 1)
                }

                let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
                    filter: s => s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_CONTAINER
                })

                for (let site of constructionSites) {

                    cm.set(site.pos.x, site.pos.y, 255)
                }

                let structures = room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_CONTAINER
                })

                for (let structure of structures) {

                    cm.set(structure.pos.x, structure.pos.y, 255)
                }


                return cm
            }
        }).path;

        // room.visual.poly(path, { stroke: COLOR_RED, strokeWidth: .15, opacity: 1, lineStyle: 'normal' });

        if (path[0]) {
            if (placedSites < 10 && Game.rooms[path[0].roomName].createConstructionSite(path[0], STRUCTURE_CONTAINER)) placedSites++;
        }

        for (let pos of path) {
            // console.log(pos)
            if (placedSites < 10 && doRoads && Game.rooms[pos.roomName].createConstructionSite(pos, STRUCTURE_ROAD) == 0) placedSites++
        }

        return placedSites;
    },


    // buildRoadTo(room, center, location) {
    //     // console.log(room, center, location)
    //     var path = room.findPath(location.pos, center, { ignoreCreeps: true });
    //     path.forEach(location => {
    //         var pos = new RoomPosition(location["x"], location["y"], room.name);
    //         if (!pos.inRangeTo(center.x, center.y, 5)) {
    //             room.createConstructionSite(location["x"], location["y"], STRUCTURE_ROAD);
    //             // new RoomVisual(room.name).text("🧱", (location["x"]), (location["y"])+0.25, {color: 'green', font: 0.8}); 
    //         }
    //     });
    // },
    buildRoad(room, center) {
        locations = locations.concat(room.find(FIND_SOURCES));
        locations = locations.concat(room.find(FIND_MINERALS));
        locations.push(room.controller);
        locations.forEach(location => {
            var path = room.findPath(location.pos, center, { ignoreCreeps: true });
            path.forEach(location => {
                var pos = new RoomPosition(location["x"], location["y"], room.name);
                if (!pos.inRangeTo(center.x, center.y, 5)) {
                    // room.createConstructionSite(location["x"], location["y"], STRUCTURE_ROAD);
                    new RoomVisual(room.name).text("🧱", (location["x"]), (location["y"]) + 0.25, { color: 'green', font: 0.8 });
                }
            });
        });
    },
    newBase(room, center) {
        // console.log(!room.storage)
        if (!room.storage) {
            baseSchematic = delete base["rampart"];
        }
        else if (room.controller.level && room.controller.level == 8) {
            for (let x = center.x - 5; x < center.x + 6; x++) {
                for (let y = center.y - 5; y < center.y + 6; y++) {
                    // new RoomVisual(room.name).text("🟡", x, y+0.25, { color: 'green', font: 0.8 }); 
                    room.createConstructionSite(x, y, "rampart");
                }
            }
        }
        else {
            baseSchematic = base;
        }
        for (var structure in base) {
            for (var position in base[structure]) {
                room.createConstructionSite(center.x + base[structure][position]["x"], center.y + base[structure][position]["y"], structure);
            }
        }
    },

    visual(room, center) {
        for (var structure in base) {
            for (var position in base[structure]) {
                new RoomVisual(room.name).text(baseVisual[structure], (center.x + base[structure][position]["x"]), (center.y + base[structure][position]["y"]) + 0.25, { color: 'green', opacity: 0.9, font: 0.8 });
            }
        }
    },

    controllerShield(room, center) {


        // var test = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)].filter(function(d) {
        //     creep.room.lookForAt(LOOK_TERRAIN, ) != "wall"
        // })

        [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)].forEach(d => {
            var x = center.x + d[0];
            var y = center.y + d[1];
            if (room.lookForAt(LOOK_TERRAIN, x, y) != "wall") {
                new RoomVisual(room.name).text("🧱", x, y + 0.25, { color: 'green', font: 0.8 });
            }
        });
        // console.log(room.getPositionAt(10,10));
        // var walls = room.lookAtArea(room.controller.pos.y+1,room.controller.pos.x-1,room.controller.pos.y-1,room.controller.pos.x+1, true);
        // walls.forEach(wall => {
        //     console.log(wall)
        // });


        // for (var x = room.controller.pos.x-1; x<=room.controller.pos.x+1; x++) {
        //     for (var y = room.controller.pos.y-1; y<=room.controller.pos.y+1; y++) {
        //         // if (room.controller.pos.y != y && room.controller.pos.x != x) {
        //             new RoomVisual(room.name).text("🧱", x, y+0.25, {color: 'green', font: 0.8}); 
        //         // }
        //     }
        // }
    },

    distanceTransform(room) {
        if (!room.controller) return;


        let vis = new RoomVisual(room.name);
        let matrix = new PathFinder.CostMatrix();
        let terrain = room.getTerrain();
        let sources = room.find(FIND_SOURCES);
        let bestScore = 999;
        sources.push(room.controller);
        let pos = undefined;
        let locationX = undefined;
        let locationY = undefined;

        for (let y = 0; y < 50; ++y) {
            for (let x = 0; x < 50; ++x) {
                if (terrain.get(x, y) == 1) {
                    matrix.set(x, y, 0);
                }
                else {
                    matrix.set(x, y,
                        Math.min(matrix.get(x - 1, y - 1), matrix.get(x, y - 1),
                            matrix.get(x + 1, y - 1), matrix.get(x - 1, y)) + 1);
                }
            }
        }

        for (let y = 49; y >= 0; --y) {
            for (let x = 49; x >= 0; --x) {
                let value = Math.min(matrix.get(x, y),
                    matrix.get(x + 1, y + 1) + 1, matrix.get(x, y + 1) + 1,
                    matrix.get(x - 1, y + 1) + 1, matrix.get(x + 1, y) + 1);
                matrix.set(x, y, value);
                vis.circle(x, y, { radius: value / 25 });
                if (value > 6) {

                    let score = 0;
                    let position = new RoomPosition(x, y, room.name);
                    sources.forEach(location => {
                        if (!location) {
                            console.log('error transform of base build')
                            return
                        };
                        score = score + location.pos.findPathTo(position).length;
                    });

                    if (score < bestScore) {
                        bestScore = score;
                        pos = position;
                        locationX = x;
                        locationY = y;
                    }
                }
            }
        }

        if (pos == undefined) {
            room.memory.baseLocation = null;
        }
        else {
            room.memory.baseLocation = pos;
        }

        return (pos);
    }

};