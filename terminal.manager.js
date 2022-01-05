
const helper = require('helper');

module.exports = {
    manage(room) {
        
        const minAmount = 1000;
        const maxAmount = 5000;

        room.memory["mineralsTypes"].forEach(RESOURCE => {
            if (room.terminal.cooldown == 0 && room.terminal.store[RESOURCE] > minAmount) {
                let amountToDispose = room.terminal.store[RESOURCE] - minAmount;

                Object.values(Game.rooms).forEach(otherRoom => {
                    if (otherRoom.controller != null && otherRoom.controller.level > 5 && otherRoom.controller.owner.username == Memory["Username"] && otherRoom.terminal.store[RESOURCE] < minAmount) {                       
                        let needed = minAmount - otherRoom.terminal.store[RESOURCE];
                        let toSend = needed < amountToDispose ? needed : amountToDispose;
                        // console.log('Auto minimum system terminal manager', toSend, RESOURCE, room.name, "To", otherRoom.name, room.terminal.send(RESOURCE, toSend, otherRoom.name, 'Auto minimum system terminal manager'));
                        room.terminal.send(RESOURCE, toSend, otherRoom.name, 'Auto minimum system terminal manager')
                    }
                });

                if (room.terminal.cooldown == 0 && room.terminal.store[RESOURCE] > maxAmount) {
                    let amountToSell = room.terminal.store[RESOURCE] - maxAmount;
                    let orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE &&
                        order.type == ORDER_BUY &&
                        Game.market.calcTransactionCost(amountToSell, room.name, order.roomName) < 5000);
                    orders = orders.sort(function (a, b) { return b.price - a.price })
                    if (orders[0] && orders[0].price > 0.1 && room.terminal.store[RESOURCE] > amountToSell) {
                        Game.market.deal(orders[0].id, amountToSell, room.name);
                    }
                }
            }
        });
    }
}