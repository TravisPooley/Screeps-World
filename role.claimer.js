const movement = require("helper.movement");
module.exports = {
    run: function (creep) {
        let target = new RoomPosition(25, 25, creep.memory.target);
        if (creep.room.name !== target.roomName) {
            creep.moveTo(target);
        }
        else if(movement.isOnExit(creep)) {
            movement.leaveExit(creep);
        }
        else {
            target = creep.room.controller;
            if (creep.room.controller.my) {
                let flag = Game.flags[creep.room.name];
                if (flag) {
                    if (creep.room.createConstructionSite(flag.pos.x, flag.pos.y+1, STRUCTURE_SPAWN) == OK) {
                        if (Game.flags[creep.room.name+" EXPANSION"] != undefined) {
                            Game.flags[creep.room.name+" EXPANSION"].remove();
                        }
                        creep.suicide();
                    }
                }
            }
            else {
                let claimResult = creep.claimController(target);
                if (claimResult == OK) {
                    if (!target.sign || target.sign.username !== "Bycrome") {
                        creep.signController(target, "Property of Bycrome");
                    }
    
                    
                }
                else if (claimResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else if (claimResult == ERR_GCL_NOT_ENOUGH) {
                    console.log(creep.name, "does not have enough GCL");
                    creep.suicide();
                }
            }
        }
    }
};