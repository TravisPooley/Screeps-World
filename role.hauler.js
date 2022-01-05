module.exports = {
    run(creep) {
        
        if(creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory["full"] && creep.carryCapacity == _.sum(creep.carry)) {
            creep.memory.full = true;
        }

        if(creep.memory["full"]== null) {
            creep.memory.full = false;
        }

        if (!creep.memory["full"]) {
            if (creep.timeToLive < 50) creep.suicide();
            let from = Game.getObjectById(creep.memory.target);
            if (from) {
                let attempt = creep.withdraw(from, _.last(Object.keys(from.store)))
                if(attempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(from);
                }
                else {
                    creep.moveTo(from);
                }
            }
            else {
                // console.log(creep.memory.target);
            }
            
        }
        else {
            let to = Game.getObjectById(creep.memory.to);
            if (to) {
                let attempt = creep.transfer(to, _.last(Object.keys(creep.store)))
                if(attempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(to);
                }
            }
        }        
    }
}