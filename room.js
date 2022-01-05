const RoomManager = require('room.manager');

global.ROOM_STANDARD = 		'room'
global.ROOM_SOURCE_KEEPER =	'source_keeper'
global.ROOM_CENTER =		'center'
global.ROOM_HIGHWAY = 		'highway'
global.ROOM_CROSSROAD = 	'highway_portal'

Room.describe = function(name) {
	const [EW, NS] = String(name).match(/\d+/g)
	if (EW%10 == 0 && NS%10 == 0) {
		return ROOM_CROSSROAD
	}
  	else if (EW%10 == 0 || NS%10 == 0) {
		return ROOM_HIGHWAY
	}
	else if (EW%5 == 0 && NS%5 == 0) {
		return ROOM_CENTER
	}
	else if (Math.abs(5 - EW%10) <= 1 && Math.abs(5 - NS%10) <= 1) {
		return ROOM_SOURCE_KEEPER
	}
	else {
		return ROOM_STANDARD
	}
}

// getRoomName() {
//     let [x,y] = [Math.floor(this.x / 50), Math.floor(this.y / 50)]
//     let result = "";
//     result += (x < 0 ? "W" + String(~x) : "E" + String(x));
//     result += (y < 0 ? "N" + String(~y) : "S" + String(y));
//     return result;
// }
    
// /** @returns boolean - do we have visibility in the room this point belongs to? */
// isVisible() {
//     let name = this.getRoomName();
//     return (Game.rooms[name] !== undefined);			
// }

Room.prototype.roomManager = function() {
    if(this._roomManager === undefined) {
        // if(this.controller && this.controller.my) {
            // console.log('test',this._roomManager)
            this._roomManager = new RoomManager(this);
            // console.log('test',this._roomManager)
        // }
    }

    return this._roomManager;
}

Room.prototype.GetPrimaryLab = function() {
    let room = this;
    return(Game.getObjectById(room.memory.primaryLab));
}

Room.prototype.GetSecondaryLab = function() {
    let room = this;
    return(Game.getObjectById(room.memory.secondaryLab));
}

Room.prototype.GetTertiaryLabs = function() {
    let room = this;
    let labs = [];
    for (let lab of room.memory.tertiaryLab) {
        labs.push(Game.getObjectById(lab));
    }
    return(labs);
}

// room.prototype.factory = 

// Room.prototype.factory = function() {
//     if(this._factory === undefined) {
//         if(this.controller && this.controller.my && this.controller.level >= 8) {
//             this._factory = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_FACTORY })[0];
//         } else {
//             this._factory = null;
//         }
//     }

//     return this._factory;
// }

Room.prototype.powerSpawn = function() {
    if(this._powerSpawn === undefined) {
        if(this.controller && this.controller.my && this.controller.level >= 8) {
            this._powerSpawn = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_POWER_SPAWN })[0];
        } else {
            this._powerSpawn = null;
        }
    }

    return this._powerSpawn;
}


// room.prototype.spawn = function() {
//     if(this._spawn === undefined) {
//         this._spawn = Object.values(Game.spawns).filter(spawn => spawn.room == this);
//     }
// }

Room.prototype.nuker = function() {
    if(this._nuker === undefined) {
        if(this.controller && this.controller.my && this.controller.level >= 8) {
            this._nuker = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_NUKER })[0];
        } else {
            this._nuker = null;
        }
    }

    return this._nuker;
}

Room.prototype.findTowerDamage = function(towers, hostile) {

    room = this

    let totalDamage = 0

    for (let tower of towers) {

        let range = tower.pos.getRangeTo(hostile.pos)

        if (range <= TOWER_OPTIMAL_RANGE) {

            totalDamage += TOWER_POWER_ATTACK
            continue
        }

        const factor = (range < TOWER_FALLOFF_RANGE) ? (range - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE) : 1
        totalDamage += Math.floor(TOWER_POWER_ATTACK * (1 - TOWER_FALLOFF * factor));
    }

    if (hostile.hasBoost(TOUGH, "GO")) totalDamage -= totalDamage * 0.3
    if (hostile.hasBoost(TOUGH, "GHO2")) totalDamage -= totalDamage * 0.5
    if (hostile.hasBoost(TOUGH, "XGHO2")) totalDamage -= totalDamage * 0.7

    return totalDamage
}

Room.prototype.findHealPower = function(hostile, creeps) {

    room = this

    let healPower = 0

    for (let creep of creeps) {

        if (creep.pos.getRangeTo(hostile.pos) <= 1) {

            healPower += creep.findParts("heal") * HEAL_POWER

            if (creep.hasBoost(HEAL, "LO")) healPower += healPower * 1
            if (creep.hasBoost(HEAL, "LHO2")) healPower += healPower * 2
            if (creep.hasBoost(HEAL, "XLHO2")) healPower += healPower * 3
        }
    }

    return healPower
}