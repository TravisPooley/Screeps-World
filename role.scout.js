const movement = require("helper.movement");
const roomBase = require('room.base');
const roomRemote = require('room.remote');

module.exports = {
    run(creep) {

		if(!creep.ticksToLive) return;

		if (creep.ticksToLive == 1499) creep.notifyWhenAttacked(false);

		if (creep.memory.target == undefined) creep.memory.target = module.exports.findNextTarget(creep);

		if(creep.memory.target && creep.room.name !== creep.memory.target) {
            movement.moveToRoom(creep, creep.memory.target);
            return;
        }
		else if(movement.isOnExit(creep)) {
            movement.leaveExit(creep);
        }
		
		if (creep.memory.target && creep.room.name == creep.memory.target) {
			module.exports.roomEntryOperations(creep);
		}
	},

	becomeGriefer(creep, target) {
		creep.memory.role = "grief";
		creep.memory.target = target;
	},

	becomeObserver(creep) {
		creep.memory.role = "observer";
	},

	roomEntryOperations(creep) {
		creep.memory.target = undefined;
		creep.room.memory.lastScouted = Game.time;
		if (creep.memory.history == undefined) creep.memory.history = [];
		creep.memory.history.push(creep.room.name);

		if (creep.memory.operation) {
			if (creep.memory.operation == "grief") {
				module.exports.becomeGriefer(creep);
			}
			else if (creep.memory.operation == "observe") {
				module.exports.becomeObserver(creep);
			}
		}
		
		if (Room.describe(creep.room) != ROOM_STANDARD) return;

		module.exports.evluateRoom(creep)

		let roomDistance = Game.map.getRoomLinearDistance(creep.memory.room, creep.room.name)

		if (roomDistance == 1) {
			module.exports.checkRemote(creep);
		}

		if (roomDistance < 4) {
			if (creep.room.memory.sources && creep.room.memory.sources.length == 2 && creep.room.memory.baseLocation != undefined && !Object.values(Memory.global.communes).includes(creep.room.name)) {
				console.log("create flag")
				if (creep.room.createFlag(creep.room.controller.pos, creep.memory.room+" EXPANSION") == ERR_NAME_EXISTS) {
					Game.flags[creep.memory.room+" EXPANSION"].remove();
					creep.room.createFlag(creep.room.controller.pos, creep.memory.room+" EXPANSION");

				}
			}
		}

	},

	findNextTarget(creep) {
		let target;
		let bestCandidate;
		// if the exits are unknown return should be known next tick
		if(!creep.room.memory.exits) return
		for(room of creep.room.memory.exits) {

			// if room is a middle room skip
			// if (Room.describe(room) == ROOM_SOURCE_KEEPER  || Room.describe(room) == ROOM_CENTER ) continue

			// if room is not avaliabe skip
			if (Game.map.getRoomStatus(room).status != "normal") continue;

			// if room has no memory set it as target
			if (!Memory.rooms[room]) return room;
			
			// defining the last scouted time
			let last = Memory.rooms[room].lastScouted;
			
			// if its never been explored set it as target
			if (last == undefined) return room;
			
			// if it is not a good canidate skip
			if (last > bestCandidate) continue;

			// update best canidate to current rooms score
			bestCandidate = last;
			// update target to currrent room
			target = room;
		}
		return target;
		
	},
	
	checkRemote(creep) {

		
		if (Memory.rooms[creep.memory.room].possibleRemotes == undefined) Memory.rooms[creep.memory.room].possibleRemotes = {};
		// if (Memory.rooms[creep.memory.room].possibleRemotes[creep.room.name] != undefined) return;

		console.log('remote evaluation',creep.room)

		let remotes = {};
		remotes["cooldown"] = null;
		remotes["sourceInfo"] = {}
		for (source of creep.room.find(FIND_SOURCES)) {
			console.log('remote evaluation of source:',source.id)
			console.log(Game.flags[creep.memory.room])
			var ret = PathFinder.search(Game.flags[creep.memory.room].pos, source.pos)

			remotes["sourceInfo"][source.id] = roomRemote.calculateCostOfaMine(ret.path.length, 0, 3000);
		}
		
		remotes["totalDistance"] = null;
		remotes["totalCost"] = null;

		Memory.rooms[creep.memory.room].possibleRemotes[creep.room.name] = remotes;

		// path = spawn.pos.findPathTo(source);
		
		// get path to room source
		// 
	},

	evluateRoom(creep) {
		if(creep.room.memory.baseLocation !== undefined) {
			console.log(JSON.stringify(creep.room.memory.baseLocation))
			if (!Game.flags[creep.room.name]) {
				if (creep.room.memory.baseLocation != null) creep.room.createFlag(creep.room.memory.baseLocation.x, creep.room.memory.baseLocation.y, creep.room.name, COLOR_BLUE, COLOR_BLUE)
			}
		}
		else {
			var test = roomBase.distanceTransform(creep.room);
			// console.log("evaluating room",creep.room.name,"", test)
			if (test) {
				creep.room.memory.baseLocation = test;
				Game.rooms[creep.room.name].createFlag(test, creep.room.name, COLOR_BLUE, COLOR_BLUE);
			}

			if (test === undefined) creep.room.memory.baseLocation = null;
		}
		
	}

}