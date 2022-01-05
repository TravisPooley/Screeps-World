module.exports = {
    run(creep) {


        if (creep.memory["full"] && _.sum(creep.carry) == 0) {
            creep.memory.full = false;
        }

        if (!creep.memory["full"] && _.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }

        if (creep.memory["full"] == null) {
            creep.memory.full = false;
        }

        if (creep.memory["mode"] == null) {
            creep.memory["mode"] = "startup";
        }

        if (creep.memory["fromID"] == null) {
            if (creep.memory["mode"] == "startup") {
                module.exports.selectWrong(creep);
            }
            else {
                module.exports.selectLab(creep);
            }
        }

        if (creep.memory.full) {

            
            var to = Game.getObjectById(creep.memory.toID);
            if (!to) return;
            
            let result = creep.transfer(to, creep.memory.resource)
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(to, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            else if (result == OK) {
                creep.memory.fromID = null;
                creep.memory.resource = null;
                creep.memory.toID = null;
            }
        }
        else {
          
            if (creep.ticksToLive > 3 && creep.memory.fromID != null) {
                var from = Game.getObjectById(creep.memory.fromID);
                let result = creep.withdraw(from, creep.memory.resource);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(from, { visualizePathStyle: { stroke: '#ff0000' } });
                }
                else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.fromID = null;
                    creep.memory.resource = null;
                    creep.memory.toID = null;
                }
            }
        }
    },
    selectWrong(creep) {
        const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_LAB && s.mineralType != undefined && s.mineralType != creep.room.memory.labs[s.id];
            }
        });
        if (target) {
            creep.memory.fromID = target.id;
            creep.memory.resource = target.mineralType;
            creep.memory.toID = creep.room.terminal.id;
        }
        else {
           creep.memory.mode = "fill";
        }
    },
    selectLab(creep) {
        const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_LAB && s.mineralType == undefined && s.mineralAmount < LAB_MINERAL_CAPACITY;
            }
        });
        if (target) {
            creep.memory.fromID = creep.room.terminal.id;
            creep.memory.resource = creep.room.memory.labs[target.id];
            creep.memory.toID = target.id;
        }
        console.log(target)

        // var labs = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_LAB});
        // for (lab of labs) {
        //     console.log(lab)
        //     console.log(lab.id)
        //     console.log(JSON.stringify(creep.room.memory.labs))
        //     console.log(creep.room.memory.labs[lab.id]["resource"])
        //     // if (creep.room.memory.labs[lab[0].id]["resource"] == null) {
        //     //     creep.memory.resource = RESOURCE_ENERGY;
        //     // }
        //     // else {
        //     //     creep.memory.resource = creep.room.memory.labs[lab[0].id]["resource"];
        //     //     creep.memory.toID = lab[0].id;
        //     // }
        // }
        
    }
}