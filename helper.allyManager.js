module.exports = {
    findHostiles: function(room, options) {
        let filter = (c) => true;
        if(options && options.filter) filter = options.filter;
        return room.find(FIND_HOSTILE_CREEPS, { filter: (c) => !ALLIES.includes(c.owner.username) && filter(c) });
    },
    findClosestHostileByRange: function(position, options) {
        let filter = (c) => true;
        if(options && options.filter) filter = options.filter;
        return position.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => !ALLIES.includes(c.owner.username) && filter(c) });
    },
    findClosestStructureByRange: function(position, options) {
        let filter = (c) => true;
        if(options && options.filter) filter = options.filter;
        return position.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (c) => !ALLIES.includes(c.owner.username) && filter(c) });
    },
    findAllies: function(room) {
        let filter = (c) => true;
        if(options && options.filter) filter = options.filter;
        return room.find(FIND_HOSTILE_CREEPS, { filter: (c) => ALLIES.includes(c.owner.username) && filter(c) });
    },
    isHostile: function(ownedThing) {
        if(!ownedThing.owner) return false;
        return !ownedThing.my && !ALLIES.includes(ownedThing.owner.username);
    },
    findHostilesInRange: function(position, range) {
        return position.findInRange(FIND_HOSTILE_CREEPS, range, { filter: (c) => !ALLIES.includes(c.owner.username) });
    },
    findHostileStructuresInRange: function(position, range) {
        return position.findInRange(FIND_HOSTILE_STRUCTURES, range, { filter: (s) => !ALLIES.includes(s.owner.username) });
        // return position.findInRange(FIND_STRUCTURES, range, { filter: (s) => !ALLIES.includes(s.owner.username) });
    }
};