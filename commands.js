const roomBase = require('room.base');
const helper = require('helper');
const allyManager = require('ally.manager');

global.help = `<span style="text-align:center;">
────────────
♦ Commands ♦
────────────
nuke(x, y, roomName)
showNukeRange() - shows the range of all the nukers
removeAllSites() - removes all construction sites

spawnScientist(roomName) - spawns 
<span>
`;

global.USERNAME = "Bycrome";

global.ALLIES = [
    'MarvinTMB',
    'Bycrome',
];

global.requestResource = function(roomName, resourceType, maxAmount, priority) {
    return(allyManager.requestResource(roomName, resourceType, maxAmount, priority))
}

global.addRemote = function (roomName, targetRoomName) {
    var remote = Memory.rooms[roomName].remote;
    if (!remote) {
        Memory.rooms[roomName].remote = [];
    }
    if (Memory.rooms[roomName].remote.indexOf(targetRoomName) == -1) {
        Memory.rooms[roomName].remote.push(targetRoomName);
    }
}

global.remotes = function(roomName) {
    var remote = Memory.rooms[roomName].remote;
    return(remote);
}

global.clearRemotes = function(roomName) {
    Memory.rooms[roomName].remote = [];
}

global.removeRemote = function (roomName, targetRoomName) {
    var remote = Memory.rooms[roomName].remote;
    Memory.rooms[roomName].remote = remote.filter(function(r) { r != targetRoomName });
}

global.printRemotes = function(roomName) {
    var remote = Memory.rooms[roomName].remote;
    console.log(remote);
}

global.showBase = function(roomName, center) {
    roomBase.visual(roomName, center);
}

global.emptyTerminal = function(roomName) {
    var terminal = Game.rooms[roomName].terminal;
    var resources = terminal.store;
    for (var resource in resources) {
        if (resource != RESOURCE_ENERGY) {
            
            let orders = Game.market.getAllOrders(order => order.resourceType == resource && order.type == ORDER_BUY && Game.market.calcTransactionCost(resources[resource], roomName, order.roomName) < 2500);
            orders = orders.sort(function (a, b) { return b.price - a.price })
            let order = orders[0];
            // sell on market for highest price
            // let order = helper.getMostExpensiveBuyOrder(resource);
            // console.log(JSON.stringify(price))
            // let amount = resources[resource] ||
            if (!orders[0]) continue; 
            let amount = (resources[resource] < order.amount ? resources[resource] : order.amount);
            console.log("attempting to sell",amount, resource, "for", order.price);
            return(Game.market.deal(order.id, amount, roomName));
        }
    }
    return ("No orders avaliable")
}

global.buyEnergy = function(roomName) {
    // buy energy from market with lowest fees and lowest price
    var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY && order.type == ORDER_SELL && Game.market.calcTransactionCost(order.amount, roomName, order.roomName) < order.amount/2);
    console.log(JSON.stringify(orders));
    // sort orders by price lowest to highest
    orders = orders.sort(function (a, b) { return b.price - a.price })
    console.log(JSON.stringify(orders[0]));
    // buy the cheapest order
    // terminal free
    if (orders[0]) {

        let amount = (orders[0].amount < Game.rooms[roomName].terminal.store.getFreeCapacity(RESOURCE_ENERGY) ? orders[0].amount : Game.rooms[roomName].terminal.store.getFreeCapacity(RESOURCE_ENERGY));
        // let amount = (orders[0].amount <  ? orders[0].amount : 1000);
        console.log("attempting to buy",amount, "for", orders[0].price);
        return(Game.market.deal(orders[0].id, amount, roomName));
    }
}

global.base = function(room) {
    roomBase.manageBase(room);
}

global.buildBase = function(room) {
    roomBase.manageBase(room);
}

global.planRoom = function (room) {
    let start = Game.cpu.getUsed();
    var base = roomBase.distanceTransform(room);
    console.log("plan room used: ",(Game.cpu.getUsed() - start), " CPU");
    return base;
}

global.spawnEmpty = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Empty");
    return(helper.spawn(spawns, [MOVE, CARRY], name, { memory: { role: 'empty', room: roomName}}));
}

global.spawnThief = function(roomName, target, boosted) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");
    if (boosted) {
        var body = helper.BuildBody([CARRY, CARRY, CARRY, CARRY, MOVE], Game.rooms[roomName], null);
        var memory = {memory: {role: 'thief', room: roomName, target: target, boosts: {tough:"", move:"", heal:""}}};
    }
    else {
        // var body = helper.BuildBody([CARRY, MOVE], Game.rooms[roomName], null);
        var body = helper.BuildBody([CARRY, CARRY, MOVE], Game.rooms[roomName], null);
        var memory = {memory: {role: 'thief', room: roomName, target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnReverseThief = function(roomName, target, boosted) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == target);
    var name = helper.nameScreep("Bycrome");
    if (boosted) {
        var body = helper.BuildBody([CARRY, CARRY, CARRY, CARRY, MOVE], Game.rooms[roomName], null);
        var memory = {memory: {role: 'thief', room: roomName, target: target, boosts: {tough:"", move:"", heal:""}}};
    }
    else {
        // var body = helper.BuildBody([CARRY, MOVE], Game.rooms[roomName], null);
        var body = helper.BuildBody([CARRY, CARRY, MOVE], Game.rooms[roomName], null);
        var memory = {memory: {role: 'thief', room: roomName, target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnGriefer = function(roomName, target) {
    return("Not finished")
}

global.spawnObserver = function(roomName, target) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");
    var memory = { memory: { role: 'scout', room: roomName, target:target, operation:"observe" } }
    var body = [MOVE]
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnDrainer = function(roomName, target, boosted) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");
    if (boosted) {
        var body = helper.BuildBody([MOVE,TOUGH,TOUGH,HEAL,TOUGH], Game.rooms[roomName], null);
        var memory = {memory: {role: 'drainer', target: target, boosts: {tough:"", move:"", heal:""}}};
    }
    else {
        var body = helper.BuildBody([TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,HEAL], Game.rooms[roomName], null);
        var memory = {memory: {role: 'drainer', target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnDismantler = function(roomName, target, boosted) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");
    if (boosted) {
        // var body = helper.BuildBody([MOVE,TOUGH,TOUGH,HEAL,TOUGH], Game.rooms[roomName], null);
        var memory = {memory: {role: 'dismantler', target: target, pirority:"", boosts: {tough:"", move:"", heal:""}}};
    }
    else {
        var body = helper.BuildBody([WORK,WORK,MOVE], Game.rooms[roomName], null);
        var memory = {memory: {role: 'dismantler', pirority:"", target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnDuoDismantler = function(roomName, target, boosted) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");
    if (boosted) {
        // var body = helper.BuildBody([MOVE,TOUGH,TOUGH,HEAL,TOUGH], Game.rooms[roomName], null);
        var memory = {memory: {role: 'dismantler', target: target, pirority:"", waitFor:true, boosts: {tough:"", move:"", heal:""}}};
    }
    else {
        var body = helper.BuildBody([WORK,WORK,MOVE], Game.rooms[roomName], null);
        var memory = {memory: {role: 'dismantler', pirority:"", waitFor:true, target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnDuo = function(roomName, target, boosted) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");

    
    if (boosted) {
        var body = helper.BuildBody([MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL], Game.rooms[roomName], null);
        var memory = {memory: {role: 'hybrid', target: target, waitFor:true, boosts: {tough:"", move:"", ranged:"", heal:""}}};
    }
    else {
        var body = helper.BuildBody([MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,HEAL], Game.rooms[roomName], null);
        // var memory = {memory: {role: 'hybrid', target: target}}
        var memory = {memory: {role: 'hybrid', waitFor:true, target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnAttackerDuo = function(roomName, target, maxSize = null, boosted = false) {
    console.log(roomName, target, maxSize, boosted)
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");

    if (boosted) {
        var body = helper.BuildBody([MOVE, ATTACK, ATTACK, ATTACK, ATTACK], Game.rooms[roomName], maxSize);
        var memory = {memory: {role: 'attacker', target: target, maxSize: maxSize, waitFor:true, boosts: {tough:"", move:"", ranged:"", heal:""}}};
    }
    else {
        var body = helper.BuildBody([MOVE, ATTACK, ATTACK], Game.rooms[roomName], maxSize);
        var memory = {memory: {role: 'attacker', waitFor:true, maxSize: maxSize, target: target}}
    }
    return(helper.spawn(spawns, body, name, memory));
}

global.spawnHybrid = function(roomName, target, maxSize = null, boosted = false) {
    console.log(roomName, target, maxSize, boosted)
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Bycrome");
    
    if (boosted) {
        var body = helper.BuildBody([MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL], Game.rooms[roomName], maxSize);
        var memory = {memory: {role: 'hybrid', target: target, maxSize: maxSize, boosts: {tough:"", move:"", ranged:"", heal:""}}};
    }
    else {
        // var body = helper.BuildBody([TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL], Game.rooms[roomName], maxSize);
        var body = helper.BuildBody([MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,HEAL], Game.rooms[roomName], maxSize);
        // var memory = {memory: {role: 'hybrid', target: target}}
        var memory = {memory: {role: 'hybrid', target: target, maxSize: maxSize}}
    }
    console.log(spawns, body, name, memory)
    return(helper.spawn(spawns, body, name, memory));
    
}

global.spawnScout = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Scout");
    return(helper.spawn(spawns, [MOVE], name, { memory: { role: 'scout', room: roomName}}));
}

global.spawnRandomScout = function() {
    var name = helper.nameScreep("Scout");
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == Memory.global.communes[helper.randomProperty(Memory.global.communes)]);
    var name = helper.nameScreep("Scout");
    return(helper.spawn(spawns, [MOVE], name, { memory: { role: 'scout', room: spawns[0].room.name}}));
}

global.spawnFactory = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Scientist");
    return(helper.spawn(spawns, [MOVE, CARRY], name, { memory: { role: 'factoryWorker', room: roomName}}));
}

global.spawnScientist = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Scientist");
    return(helper.spawn(spawns, [MOVE, CARRY], name, { memory: { role: 'scientist', room: roomName}}));
}

global.spawnDistributor = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Distributor");
    return(helper.spawn(spawns, [MOVE, CARRY], name, { memory: { role: 'distributor', room: roomName}}));
}

global.spawnLabFiller = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Lab");
    return(helper.spawn(spawns, [MOVE, CARRY], name, { memory: { role: 'labFiller', room: roomName}}));
}


global.spawnFactoryWorker = function(roomName) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Factory Worker ");
    return(helper.spawn(spawns, [MOVE, CARRY], name, { memory: { role: 'factoryWorker', room: roomName}}));
}

global.showNukeRange = function () {
    let nukers = Object.values(Game.structures).filter(structure => structure.structureType === STRUCTURE_NUKER);

    nukers.forEach(nuker => {
        Game.map.visual.circle(nuker.pos, { fill: 'transparent', radius: NUKE_RANGE * 50, stroke: '#ff0000' });
    });
}

global.sendNukes = function (number, x, y, roomName) {
    let nukepos = new RoomPosition(x, y, roomName);
    
    let nukers = [];
    // Memory.global.communes.forEach(room => {
    for (room of Memory.global.communes) {
        if (Memory.rooms[room].controllerLevel !== 8) continue;
        nukers.push(Game.rooms[room].nuker())
    }


    console.log(nukers)
    // let nukers = Object.values(Game.structures).filter(structure =>
    //     structure.structureType === STRUCTURE_NUKER &&
    //     Game.map.getRoomLinearDistance(structure.pos.roomName, nukepos.roomName, false) <= NUKE_RANGE &&
    //     structure.room.terminal &&
    //     structure.room.terminal.store[RESOURCE_GHODIUM] > 5000 &&
    //     structure.isActive()
    // );



    // loop through nuker rooms
    // if room does not have enough materials remove from list
    // room.terminal.store() >


    // if (number < 1) return "invalid number of nukes";

    // if (number > nukers.length) return "Not enough nukers avaliable";

    // for(i=0; i < number; i++) {

    //     console.log(i, nukers)
    // }


    // if still have enough nukes
    // loop through nukes
    // place flags 
    // Game.rooms.roomName.createFlag(x, y, nuker.room.name+' NUKE');


    return nukepos;


    // return "status";
}

global.nuke = function (x, y, roomName) {
    let nukepos = new RoomPosition(x, y, roomName);

    if (!nukepos) return `Invalid target`;

    let nuker = _.find(Game.structures, structure =>
        structure.structureType === STRUCTURE_NUKER &&
        Game.map.getRoomLinearDistance(structure.pos.roomName, nukepos.roomName, false) <= NUKE_RANGE &&
        structure.room.terminal &&
        structure.room.terminal.store[RESOURCE_GHODIUM] > 5000 &&
        structure.isActive()
    );

    if (nuker) {
        Game.rooms[nukepos.roomName].createFlag(x, y, nuker.room.name + ' NUKE', COLOR_RED, COLOR_RED);
        return "nuke dispatched from " + nuker.room.name;
    }
    else {
        return `No available nuker for this target`;
    }
}

global.expand = function (roomName) {
    // find the closest room 
}

global.attack = function (roomName) {

}

global.removeAllConstructionSitesWithNoProgress = function (roomName) {
    var room = Game.rooms[roomName];
    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    constructionSites.forEach(function (constructionSite) {
        if (constructionSite.progressTotal == 0) {
            constructionSite.remove();
        }
    });
}

global.removeAllConstructionSites = function (roomName) {
    var room = Game.rooms[roomName];
    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    constructionSites.forEach(function (constructionSite) {
        constructionSite.remove();
    });
}

global.removeAllSites = function () {

    for (let value in Game.constructionSites) {

        let cSite = Game.constructionSites[value]

        cSite.remove()
    }

    return "removed all sites"
}


// test auto fill room
// find closest enemy room
global.findClosestEnemyRoom = function() {

    for (let friendly of Memory.global.communes) {
        // console.log(friendly)
       
    }


    
    //
    // return closestRoom;
}

global.findClosestEnemyRoomFromRoom = function(room) {
    let closestRoom = "";
    let closestDistance = 99999;
    for (let roomName in Memory.rooms) {
        if (roomName == room) continue;
        // if (!Memory.rooms[roomName].controller) continue;
        // if (Memory.rooms[roomName].controller.my) continue;
        if (!Memory.rooms[roomName].owner) continue;

        // maybe dissable this
        if (Memory.rooms[roomName].owner == "Invader") continue;
        
        // HARDCODED USERNAME NEEDS CHANGING
        if (Memory.rooms[roomName].owner == "Bycrome") continue;
        if (ALLIES.includes(Memory.rooms[roomName].owner)) continue;
        
        let distance = Game.map.findRoute(room, roomName).length;
        if (distance < closestDistance) {
            closestDistance = distance;
            closestRoom = roomName;
        }
        
    }
    return closestRoom;
}

global.sendClaimer = function (roomName, target) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Claimer");
    return(helper.spawn(spawns, [CLAIM, MOVE, MOVE, MOVE], name, { memory: { role: 'claimer', room: roomName, target: target}}));
}

global.sendBuilder = function (roomName, target) {
    var spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == roomName);
    var name = helper.nameScreep("Builder");
    return(helper.spawn(spawns,  helper.BuildBody([CARRY, WORK, MOVE], Game.rooms[roomName], null), name, { memory: { role: 'builder', room: roomName, target: target}}));
}

global.sendScoutToTargetRoom = function(from, to) {
    let spawns = Object.values(Game.spawns).filter(spawn => spawn.room.name == from);
    var name = helper.nameScreep("Scout");
    return(helper.spawn(spawns, [MOVE, MOVE, MOVE], name, { memory: { role: 'scout', room: from, target: to}}));
}

global.sendScoutToClosestRoom = function(roomName) {
    let closestRoom = findClosestEnemyRoomFromRoom(roomName);
    return(sendScoutToTargetRoom(roomName, closestRoom));
}


global.sendDuoToClosestRoom = function(roomName, boost) {
    spawnHybrid(roomName, findClosestEnemyRoomFromRoom(roomName), boost);
}