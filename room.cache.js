module.exports = {
    source(room) {
        var sources = room.find(FIND_SOURCES);
        var sourceList = [];
        for (var source in sources) {
            sourceList.push(sources[source].id);
        }
        room.memory["sources"] = sourceList;

        room.memory["sourceContainers"] = {}
        sources.forEach(source => {
            var inRange = source.pos.findInRange(FIND_STRUCTURES, 2).filter(a => a.structureType == STRUCTURE_CONTAINER);
            if (inRange[0]) {
                room.memory["sourceContainers"][source.id] = inRange[0].id
            }
        });
    },
    mineral(room){
        if (!room.memory["mineral"]) {
            var mineral = room.find(FIND_MINERALS).shift();
            if (mineral) {
                room.memory["mineral"] = {"id": mineral.id, "mineralType": mineral.mineralType, "density": mineral.density};
            }
            else {
                room.memory["mineral"] = null;
            }
        }
    },
    owner(room) {
        if (!room.controller) room.memory.owner = undefined;
        else {
            if (room.controller.owner && room.controller.owner.username) room.memory.owner = room.controller.owner.username;
            else room.memory.owner = undefined;
        }
    },
    controller(){

    },
    extension(room) {
        const extensions = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === "extension" });
        room.memory["extensions"] = extensions.map(e => e.id);
        // cpu = Game.cpu.getUsed();
        // ids.forEach(id => Game.getObjectById(id));
        // console.log(`cpu: ${Game.cpu.getUsed() - cpu}`);

    },
    factory(room) {
        let factory = room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_FACTORY })[0];
        (factory) ? room.memory["factory"] = factory.id : room.memory["factory"] = undefined;
    },
    nuker(room) {
        let nuker = room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_NUKER })[0];
        (nuker) ? room.memory["nuker"] = nuker.id : room.memory["nuker"] = undefined;
    },
    ownedRooms(room) {
        let controller = room.controller;
        if (!controller || !controller.my || Memory.global.communes.includes(room.name)) return;
        Memory.global.communes.push(room.name);
    },
    links(room) {
        
        let flag = Game.flags[room.name];
        if (flag) room.memory["mainLink"] = flag.pos.findInRange(FIND_MY_STRUCTURES, 3).filter(a => a.structureType == STRUCTURE_LINK)[0];
        if (room.controller) room.memory["controllerLink"] = room.controller.pos.findInRange(FIND_MY_STRUCTURES, 5).filter(a => a.structureType == STRUCTURE_LINK);

        var sources = room.find(FIND_SOURCES);
        room.memory["sourceLinks"] = {};
        sources.forEach(source => {
            var inRange = source.pos.findInRange(FIND_MY_STRUCTURES, 3).filter(a => a.structureType == STRUCTURE_LINK);
            if (inRange[0]) {
                room.memory["sourceLinks"][source.id] = inRange[0].id;
            }
        });

    },
    labs(room) {
        let flag = Game.flags[room.name];
        if (!flag) return;
        let primary = room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_LAB && structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y - 4)})[0];
        let secondary = room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_LAB && structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y - 3)})[0];
        let tertiary =  room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_LAB && (structure != primary || structure != secondary)});
        if (primary) room.memory.primaryLab = primary.id;
        if (secondary) room.memory.secondaryLab = secondary.id;
        if (tertiary) room.memory.tertiaryLab = tertiary.map(t => t.id);

        var allLabs = room.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_LAB);
        // var labs = allLabs.map(lab => 
        //     (lab.pos.x == (flag.pos.x + 3) && lab.pos.y == (flag.pos.y - 2)) ? RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE ||
        //     (lab.pos.x == (flag.pos.x + 2) && lab.pos.y == (flag.pos.y - 3)) ? RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE ||
        //     (lab.pos.x == (flag.pos.x + 3) && lab.pos.y == (flag.pos.y - 4)) ? RESOURCE_CATALYZED_UTRIUM_ACID ||
        //     (lab.pos.x == (flag.pos.x + 5) && lab.pos.y == (flag.pos.y - 4)) ? RESOURCE_CATALYZED_UTRIUM_ALKALIDE ||
        //     (lab.pos.x == (flag.pos.x + 5) && lab.pos.y == (flag.pos.y - 3)) ? RESOURCE_CATALYZED_KEANIUM_ACID ||
        //     (lab.pos.x == (flag.pos.x + 2) && lab.pos.y == (flag.pos.y - 4)) ? RESOURCE_CATALYZED_KEANIUM_ALKALIDE ||
        //     (lab.pos.x == (flag.pos.x + 4) && lab.pos.y == (flag.pos.y - 5)) ? RESOURCE_CATALYZED_LEMERGIUM_ACID ||
        //     (lab.pos.x == (flag.pos.x + 4) && lab.pos.y == (flag.pos.y - 3)) ? RESOURCE_CATALYZED_ZYNTHIUM_ACID ||
        //     (lab.pos.x == (flag.pos.x + 3) && lab.pos.y == (flag.pos.y - 5)) ? RESOURCE_CATALYZED_GHODIUM_ACID ||
        //     (lab.pos.x == (flag.pos.x + 4) && lab.pos.y == (flag.pos.y - 2)) ? RESOURCE_CATALYZED_GHODIUM_ALKALIDE
        // );

        let labs = {};
        for (let lab of allLabs) {
            if (lab.pos.x == (flag.pos.x + 3) && lab.pos.y == (flag.pos.y - 2)) labs[lab.id] = RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE;
            if (lab.pos.x == (flag.pos.x + 2) && lab.pos.y == (flag.pos.y - 3)) labs[lab.id] = RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE;
            if (lab.pos.x == (flag.pos.x + 3) && lab.pos.y == (flag.pos.y - 4)) labs[lab.id] = RESOURCE_CATALYZED_UTRIUM_ACID;
            if (lab.pos.x == (flag.pos.x + 5) && lab.pos.y == (flag.pos.y - 4)) labs[lab.id] = RESOURCE_CATALYZED_UTRIUM_ALKALIDE;
            if (lab.pos.x == (flag.pos.x + 5) && lab.pos.y == (flag.pos.y - 3)) labs[lab.id] = RESOURCE_CATALYZED_KEANIUM_ACID;
            if (lab.pos.x == (flag.pos.x + 2) && lab.pos.y == (flag.pos.y - 4)) labs[lab.id] = RESOURCE_CATALYZED_KEANIUM_ALKALIDE;
            if (lab.pos.x == (flag.pos.x + 4) && lab.pos.y == (flag.pos.y - 5)) labs[lab.id] = RESOURCE_CATALYZED_LEMERGIUM_ACID;
            if (lab.pos.x == (flag.pos.x + 4) && lab.pos.y == (flag.pos.y - 3)) labs[lab.id] = RESOURCE_CATALYZED_ZYNTHIUM_ACID;
            if (lab.pos.x == (flag.pos.x + 3) && lab.pos.y == (flag.pos.y - 5)) labs[lab.id] = RESOURCE_CATALYZED_GHODIUM_ACID;
            if (lab.pos.x == (flag.pos.x + 4) && lab.pos.y == (flag.pos.y - 2)) labs[lab.id] = RESOURCE_CATALYZED_GHODIUM_ALKALIDE;
        }
        // var labs = {
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y - 2)).id]: { "resource": RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 2) && structure.pos.y == (flag.pos.y - 3)).id]: { "resource": RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y - 4)).id]: { "resource": RESOURCE_CATALYZED_UTRIUM_ACID},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 5) && structure.pos.y == (flag.pos.y - 4)).id]: { "resource": RESOURCE_CATALYZED_UTRIUM_ALKALIDE},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 5) && structure.pos.y == (flag.pos.y - 3)).id]: { "resource": RESOURCE_CATALYZED_KEANIUM_ACID},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 2) && structure.pos.y == (flag.pos.y - 4)).id]: { "resource": RESOURCE_CATALYZED_KEANIUM_ALKALIDE},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y - 5)).id]: { "resource": RESOURCE_CATALYZED_LEMERGIUM_ACID},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y - 3)).id]: { "resource": RESOURCE_CATALYZED_ZYNTHIUM_ACID},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 3) && structure.pos.y == (flag.pos.y - 5)).id]: { "resource": RESOURCE_CATALYZED_GHODIUM_ACID},
        //     [allLabs.find(structure => structure.pos.x == (flag.pos.x + 4) && structure.pos.y == (flag.pos.y - 2)).id]: { "resource": RESOURCE_CATALYZED_GHODIUM_ALKALIDE}
        // };

        console.log(JSON.stringify(labs))
        if (labs) room.memory.labs = labs;

        // if (labs.find(lab => !lab.lab)) return;
        // room.memory.labs = labs.map(lab => {
        //     if (!lab.lab) return;
        //     return {
        //         "id": lab.lab.id,
        //         "resource": lab.resource
        //     }
        // });
    }

}