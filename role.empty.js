
module.exports = {
    run(creep) {


        let factory = creep.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_FACTORY })[0];

        if (!factory || !creep.room.terminal) {
            creep.say('no');
            return;
        }

        if (creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }

        if (!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }

        if (creep.memory["full"] == null) {
            creep.memory.full = false;
        }


        if (creep.memory["full"]) {
            if (creep.transfer(creep.room.terminal, _.last(_.keys(creep.store))) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.terminal);
            }
        }
        else {
            if (creep.withdraw(factory, _.last(_.keys(factory.store))) == ERR_NOT_IN_RANGE) {
                creep.moveTo(factory);
            }
        }
        
    }
}