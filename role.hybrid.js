const boosting = require("helper.boosting");
const movement = require("helper.movement");
const enemy = require("helper.allyManager");
const helper = require('helper');

const prioritizedStructures = [STRUCTURE_SPAWN, STRUCTURE_TOWER];

module.exports = {
    run: function (creep) {
        creep.heal(creep);

        if (creep.memory.boosts) {
            boosting.tryBoost(creep);
            return;
        }

        var flag = Game.flags["Attack"];

        if (!flag) console.log("No attack flag found");

        if (creep.pos.roomName == flag.pos.roomName) {
            module.exports.attackRoom(creep);
        } else {
            module.exports.approachRoom(creep, flag.pos.roomName);
        }
    },
    attackRoom: function (creep) {
        let hostiles = enemy.findHostiles(creep.room);

        hostiles = _.sortBy(_.sortBy(hostiles, (h) => h.pos.getRangeTo(creep)), (h) => _.some(h.body, (p) => p.type === ATTACK || p.type === RANGED_ATTACK) ? 0 : 1);
        let target = hostiles[0];

        if (target) {
            module.exports.attack(creep, target);
        } else {
            let friends = creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax });
            if (creep.hits === creep.hitsMax && friends.length > 0) {
                if (creep.heal(friends[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(friends[0], { maxRooms: 1 });
                }
            } else {
                creep.moveTo(Game.flags["Attack"], { maxRooms: 1 });
            }
        }
    },
    attack: function (creep, target) {
        let targetRange = creep.pos.getRangeTo(target);
        let closeHostiles = _.filter(ff.findHostiles(creep.room), (c) => c.pos.getRangeTo(creep) <= 3);
        let dangerousHostiles = _.filter(closeHostiles, (c) => c.pos.getRangeTo(creep) <= 2 && c.canAttack());
        if (targetRange <= 3) {
            this.shoot(creep, target);
        } else {
            if (dangerousHostiles.length > 0 || closeHostiles.length > 0) {
                this.shoot(creep, dangerousHostiles[0] || closeHostiles[0]);
            }
        }

        if (dangerousHostiles.length > 0) {
            creep.fleeFrom(dangerousHostiles, 3);
        } else {
            if ((target.canAttack() && targetRange > 3) || targetRange > 2) {
                creep.moveTo(target, { maxRooms: 1 });
            }
        }
    },
    shoot: function (creep, target) {
        if (creep.pos.getRangeTo(target) == 1) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(target);
        }
    },





    // run: function (creep) {

    //     if (creep.ticksToLive == CREEP_LIFE_TIME - 1) creep.notifyWhenAttacked(false);


    //     // if(!creep.ticksToLive) {
    //     //     // module.exports.prespawningOperations(creep);
    //     //     return;
    //     // }



    //     if (creep.memory.boosts) {
    //         boosting.tryBoost(creep);
    //         return;
    //     }

    //     // if (creep.hits < creep.hitsMax) {
    //     //     creep.heal(creep);
    //     // }

    //     creep.heal(creep);


    //     const HOSTILE_CREEPS = enemy.findHostilesInRange(creep.pos, 3);
    //     const HOSTILE_STRUCTURES = enemy.findHostileStructuresInRange(creep.pos, 3);
    //     const targets = HOSTILE_CREEPS.concat(HOSTILE_STRUCTURES);

    //     if (targets.length > 0) {
    //         creep.rangedMassAttack();
    //     }
    //     if (targets) {
    //         creep.rangedAttack(targets);
    //     }

    //     let target = new RoomPosition(25, 25, creep.memory.target);

    //     if (creep.room.name === target.roomName) {
    //         module.exports.attackRoom(creep, target);
    //     }
    //     else {
    //         module.exports.approachRoom(creep, target);
    //     }
    // },
    // prespawningOperations: function (creep) {
    //     console.log(Object.keys(creep))
    // },
    // attackRoom: function (creep, position) {
    //     let target;

    //     if (prioritizedStructures.length > 0) {
    //         for (let structureType of prioritizedStructures) {
    //             if (target) break;
    //             target = enemy.findClosestStructureByRange(creep.pos, { filter: (s) => s.structureType == structureType });
    //         }
    //     }



    //     if (!target) {
    //         target = enemy.findClosestHostileByRange(creep.pos, { filter: (c) => c.pos.x != 0 || c.pos.x != 49 || c.pos.y != 49 || c.pos.y != 0 });
    //     }

    //     if (!target) {
    //         target = enemy.findClosestStructureByRange(creep.pos, { filter: (s) => s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_RAMPART });
    //     }


    //     // console.log("att",target)
    //     // if (!creep.canAttack()) {
    //     //     creep.fleeFrom(target, 10)
    //     // }
    //     // else 
    //     if (target) {
    //         // module.exports.attack(creep, target);
    //         let move = creep.moveTo(target);
    //         if (move === ERR_NO_PATH) {
    //             creep.rangedMassAttack();
    //         }
    //     } else {
    //         module.exports.aggressiveMove(creep, position);
    //     }
    // },


    // aggressiveMove: function (creep, target) {
    //     if (module.exports.shouldWait(creep)) return;

    //     if (creep.moveTo(target, { maxRooms: 1, reusePath: CREEP_LIFE_TIME }) === ERR_NO_PATH) {
    //         creep.moveTo(target, { ignoreDestructibleStructures: true, maxRooms: 1, reusePath: CREEP_LIFE_TIME });
    //     }

    //     if (creep.memory._move && creep.memory._move.path) {
    //         let nextStep = Room.deserializePath(creep.memory._move.path)[0];
    //         // let moveTarget = _.find(creep.room.lookForAt(LOOK_STRUCTURES, creep.room.getPositionAt(nextStep.x, nextStep.y)), (s) => s.structureType === STRUCTURE_WALL || ff.isHostile(s));
    //         let moveTarget = _.find(creep.room.lookForAt(LOOK_STRUCTURES, creep.room.getPositionAt(nextStep.x, nextStep.y)), (s) => s.structureType === STRUCTURE_WALL);
    //         if (!moveTarget) {
    //             moveTarget = _.find(creep.room.lookForAt(LOOK_CREEPS, creep.room.getPositionAt(nextStep.x, nextStep.y)), (c) => c.owner.username != Memory["Username"]);
    //         }

    //         if (!moveTarget) {
    //             // let closeHostiles = _.filter(ff.findHostiles(creep.room), (c) => c.pos.isNearTo(creep));
    //             let closeHostiles = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), (c) => c.pos.isNearTo(creep));
    //             moveTarget = closeHostiles[0];
    //         }
    //         // console.log('mov',moveTarget)
    //         if (moveTarget) {
    //             creep.attack(moveTarget);
    //         }
    //     }
    // },
    approachRoom: function (creep, roomName) {
        if (!module.exports.shouldWait(creep)) {
            movement.moveToRoom(creep, roomName);
        }
    },
    shouldWait: function (creep) {
        if (movement.isOnExit(creep)) return false;

        // console.log(creep.memory.waitFor && creep.room.controller && creep.room.controller.my)
        if (creep.room.controller && creep.room.controller.my) {
            // automatically rally close to the room border
            if (movement.isWithin(creep, 5, 5, 45, 45)) return false;
        }


        if (!!creep.memory.waitFor && creep.room.controller && creep.room.controller.my) {
            console.log("Attacker " + creep.name + " waiting for follower to be spawned. (" + creep.room.name + ")");
            if (helper.GetAmountOfRoleTargeting("healer", creep.name) < 1) {
                creep.say("need medic")
                var spawns = Object.values(Game.spawns).filter(spawn => spawn.room == creep.room);
                var name = helper.nameScreep("Medic")
                creep.memory.waitFor = name;
                helper.spawn(spawns, helper.BuildBody([MOVE, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name } });
                // helper.spawn(spawns, helper.BuildBody([TOUGH, MOVE, MOVE, MOVE, HEAL], creep.room, null), name, { memory: { role: 'healer', target: creep.name}});
                return true;
            }
        }

        let waitFor = Game.creeps[creep.memory.waitFor];

        if (!waitFor) return false;

        return !creep.pos.isNearTo(waitFor);
    }
    // flee
    // 30 ranged attack
    // 10 move
    // 10 heal

    // t3 boosted build
    // 11 tough
    // 10 move
    // 6 ranged attack
    // 23 heal
    // Game.spawns['Spawn2'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'Bycrome', {memory: {role: 'hybrid', target: "W9N1", boosts: {tough:"", move:"", ranged:"", heal:""}}});

    // Game.spawns['Spawn2'].spawnCreep([TOUGH, MOVE, MOVE, RANGED_ATTACK, HEAL], 'Bycrome', {memory: {role: 'hybrid', target: "W9N1", boosts: {tough:"", move:"", ranged:"", heal:""}}});
    // ghost build
    // 25 move
    // 16 ranged attack
    // 8 heal
    // Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE], 'Bycrome', {memory: {role: 'hybrid', target: "W9N1"}});

    // custom unboosted
    // Game.spawns['Spawn2'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'Bycrome-1', {memory: {role: 'hybrid', target: "W9N1"}});

    // custom duo unboosted
    // Game.spawns['Spawn2'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'Bycrome-1', {memory: {role: 'hybrid', target: "W5N4", waitFor: "Bycrome-2"}});
    // Game.spawns['Spawn4'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], "Bycrome-2", { memory: { role: 'healer', target: "Bycrome-1"}});



    // duo boosted
    // Game.spawns['Spawn2'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'Bycrome-1', {memory: {role: 'hybrid', target: "W9N1", waitFor: "Bycrome2"}});
    // Game.spawns['Spawn4'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE], "Bycrome-2", { memory: { role: 'healer', target: "Bycrome-1"}});


};