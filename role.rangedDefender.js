const enemy = require("helper.allyManager");

module.exports = {
    run: function(creep) {

        creep.say("Broke")

        let closestHostile = enemy.findClosestHostileByRange(creep.pos, { filter: (c) => c.pos.x != 0 || c.pos.x != 49 || c.pos.y != 49 || c.pos.y != 0});

        creep.say("No Enemy")

        if (closestHostile) {

            creep.say("Enemy")

            let rampart = closestHostile.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_RAMPART
            })

            if (rampart) {

                creep.say("Rampart")

                let goal = _.map([rampart], function(target) {
                    return { pos: target.pos, range: 0 }
                })

                creep.rampartPathing(creep.pos, goal)

                if (creep.pos.getRangeTo(closestHostile) == 1) {

                    creep.rangedMassAttack()
                } else {

                    creep.rangedAttack(closestHostile)
                }
            } else {

                creep.say("NE")

                if (!(closestHostile.pos.x <= 0 || closestHostile.pos.x >= 49 || closestHostile.pos.y <= 0 || closestHostile.pos.y >= 49)) {

                    creep.say("H")

                    if (creep.pos.getRangeTo(closestHostile) > 3) {

                        let goal = _.map([closestHostile], function(rampart) {
                            return { pos: rampart.pos, range: 1 }
                        })

                        creep.intraRoomPathing(creep.pos, goal)

                    } else {

                        if (creep.pos.getRangeTo(closestHostile) == 1) {

                            creep.rangedMassAttack()

                        } else if (creep.pos.getRangeTo(closestHostile) <= 3) {

                            creep.rangedAttack(closestHostile)
                        }
                    }
                    if (creep.pos.getRangeTo(closestHostile) <= 2) {

                        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                        creep.fleeFrom(hostiles, 5);
                    }
                }
            }
        }
    }
};
