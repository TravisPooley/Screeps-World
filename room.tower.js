module.exports = {
    run: function (room, storage, controllerLevel, hostiles) {
        if (controllerLevel < 3) return;

        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });

        if (towers.length == 0) return;

        
        if (this.attackHostiles(room, towers, hostiles)) return;
        if (this.healCreeps(room, towers)) return;

        // if (this.healPowerCreeps(towers)) return
        // if (this.repairEcoStructures(towers)) return
        if (this.repairRamparts(room, towers)) return


    },

    findBestTarget(room, towers, hostiles, enemyHealers) {

        for (let minDamage = towers.length * TOWER_POWER_ATTACK; minDamage > 100; minDamage -= 100) {

            for (let hostile of hostiles) {

                if (hostile.pos.x <= 0 || hostile.pos.x >= 49 || hostile.pos.y <= 0 || hostile.pos.y >= 49) continue

                if (room.findTowerDamage(towers, hostile) - room.findHealPower(hostile, enemyHealers) >= minDamage) return hostile
            }
        }
    },

    attackHostiles(room, towers, hostiles) {

        if (hostiles.length == 0) return false;

        let enemyHealers = hostiles.filter(hostileCreep => hostileCreep.hasPartsOfTypes([HEAL]));

        if (enemyHealers.length > 0) {
            target = this.findBestTarget(room, towers, hostiles, enemyHealers);

        } else {
            target = hostiles.reduce(function (highestDamage, hostile) {
                return hostile.num > highestDamage.num ? hostile : highestDamage
            });
        }

        if (!target) return false;

        this.towersAttack(towers, target);

        return true;
    },

    healCreeps(room, towers) {
        let injuredCreeps = room.find(FIND_CREEPS, { filter: injuredCreep => injuredCreep.my && injuredCreep.hits < injuredCreep.hitsMax - 50 })

        if (injuredCreeps.length == 0) return false

        this.towersHeal(towers, injuredCreeps[0]);

        return true
    },

    repairRamparts(room, towers) {

        // if (storage && storage.store[RESOURCE_ENERGY] > 150000 * room.memory.sources.length) return false
        
        let repairTarget = room.find(FIND_STRUCTURES, {
            filter: s => (s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax) || (s.structureType == STRUCTURE_RAMPART && s.hits <= 25000) || (s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax)
        })[0];
        
        if (!repairTarget) return false
    
        this.towersRepair(towers, repairTarget)
    
        return true
    },

    towersAttack(towers, target) {
        for (let tower of towers) {
            tower.attack(target);
        }
    },

    towersHeal(towers, target) {
        for (let tower of towers) {
            tower.heal(target);
        }
    },

    towersRepair(towers, target) {
        for (let tower of towers) {
            tower.repair(target);
        }
    }
}