module.exports = class Links {
    constructor(room) {
    }

    run(room) {
        
    }

    // calculateTowerMaxDamage(room) {
    //     var towers = room.find(FIND_MY_STRUCTURES, {
    //         filter: { structureType: STRUCTURE_TOWER }
    //     });

    //     var maxDamage = 0;

    //     for (let tower of towers) {
    //         var towerDamage = tower.getActiveBodyparts(ATTACK) * tower.attackPower +
    //             tower.getActiveBodyparts(RANGED_ATTACK) * tower.attackPower * 2 +
    //             tower.getActiveBodyparts(HEAL) * tower.healPower;

    //         if (towerDamage > maxDamage) {
    //             maxDamage = towerDamage;
    //         }
    //     }
    // }

    planBreakThrough(room) {
        
        // var path = PathFinder.search(location.pos, goal, {
        //     plainCost: 4,
        //     swampCost: 24,
        //     maxRooms: 1,

        //     roomCallback: function(roomName) {

        //         let cm

        //         cm = new PathFinder.CostMatrix
        //     }
        // });

        const structures = room.find(FIND_STRUCTURES);
        
        var matrix = new Pathfinder.CostMatrix();

        for(let x = 0; x < 50; x++) {
            for(let y = 0; y < 50; y++) {
                matrix.set(x, y, 1);
            }
        }

        for (let structure of structures) {

            // if (structure.structureType == STRUCTURE_ROAD) {
            //     matrix.set(structure.pos.x, structure.pos.y, 1);
            // } else if (structure.structureType == STRUCTURE_CONTAINER) {
            //     matrix.set(structure.pos.x, structure.pos.y, 5);
            // } else 
            if (structure.structureType == STRUCTURE_RAMPART) {
                matrix.set(structure.pos.x, structure.pos.y, structure.hits);
            } else if (structure.structureType == STRUCTURE_WALL) {
                matrix.set(structure.pos.x, structure.pos.y, structure.hits);
            }
        }





       
    }


        // const maxHits = _.max(_.map(_.filter(structs, s => obstacle[s.structureType] && s.hits <= PASSABLE_HITS), s => s.hits)) || 1;
        

     // _.forEach(structs, s => {
        //     if(!obstacle[s.structureType]) return;
        //     var cost = s.hits / DISMANTLE_PER_TICK;
        //     if(s.hits > PASSABLE_HITS) {
        //         cost = 255; // another 5 is added later, but it feels weird to leave it off.
        //     } else if cost > LINEAR_MAX_TICKS {
        //         cost = cost/HIGH_COST_RATIO + LINEAR_MAX_TICKS;
        //     }
        //     matrix.set(s.pos.x, s.pos.y, BASE_WALL_COST+cost);
        // });
}