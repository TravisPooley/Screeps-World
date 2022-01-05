
module.exports = {
    shouldWait: function(creep) { 
        if(movement.isOnExit(creep)) return false;

        // console.log(creep.memory.waitFor && creep.room.controller && creep.room.controller.my)
        if(creep.room.controller && creep.room.controller.my) {
            // automatically rally close to the room border
            if(movement.isWithin(creep, 5, 5, 45, 45)) return false;
        }

        if(creep.memory.waitFor && creep.room.controller && creep.room.controller.my) {
            creep.say('need medic')
            if (helper.GetAmountOfRoleTargeting("healer", creep.name) < 1) {
                var spawns = Object.values(Game.spawns).filter(spawn => spawn.room == creep.room);
                var name = helper.nameScreep("Medic")
                creep.memory.waitFor = name;
                helper.spawn(spawns, helper.BuildBody([MOVE, HEAL, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                // helper.spawn(spawns, helper.BuildBody([TOUGH, MOVE, MOVE, MOVE, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                return true;
            }
        }

        let waitFor = Game.creeps[creep.memory.waitFor];
       
        if(!waitFor) return false;

        return !creep.pos.isNearTo(waitFor);
    }
}