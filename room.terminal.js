const simpleAllies = require('simpleAllies');

const allowedSalesHistoryDeviation = 0.5;
const bases = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];
const boosts = [
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
        "UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2",
        "UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO"
]

const minerals = ["H", "O", "U", "K", "L", "Z", "X"]

module.exports = class Trading {
        constructor(room) {
                this.room = room;
                this.toSell = room.memory.mineralsTypes;
                this.sellingBlacklist = [RESOURCE_ENERGY, "XGHO2", "XGH2O", "XKHO2", "XKH2O", "XLHO2", "XLH2O", "XUHO2", "XUH2O", "XZHO2", "XZH2O", "G", "OH"];
                this.minAmount = 1000;
                this.maxAmount = 15000;
        }

        run(room, terminal) {

                // console.log("terminal manager "+room.name);
                if (!terminal) return;

                let roomMineral = room.memory.mineralsTypes[0];

                if (terminal.cooldown === 0) {


                        if (terminal.store[roomMineral] > this.minAmount && this.tradeToOtherRooms(room, terminal, roomMineral)) return;

                        // if (terminal.store[roomMineral] > this.minAmount && this.tradeToAllies(room, terminal, roomMineral)) return;

                        // trade excess energy to other rooms
                        // if (terminal.store[RESOURCE_ENERGY] > this.maxAmount && this.tradeExcessEnergy(room, terminal)) return;

                        // if (terminal.store[roomMineral] > this.maxAmount && this.sellToFreeMarket(roomMineral, terminal.store[roomMineral] - this.maxAmount)) return;

                        if (Game.market.credits && terminal.store[base] < minAmount && this.buyFromFreeMarket(base, minAmount - terminal.store[base])) return;

                        for (let resource of Object.keys(terminal.store)) {
                                if (!minerals.includes(resource) && resource != roomMineral && resource != RESOURCE_ENERGY) {
                                        if (terminal.store[resource] > this.minAmount/2) {
                                                if (this.tradeToAllies(room, terminal, resource, this.minAmount/2)) return
                                        }
                                }
                                else if (resource == roomMineral) {
                                        if (terminal.store[resource] > this.maxAmount) {
                                                if(this.tradeToAllies(room, terminal, resource, this.maxAmount)) return
                                        }
                                }
                        }
                }
        }

        ManageRequest(room, terminal) {
                let roomMineral = room.memory.mineralsTypes[0];
                if (Object.values(room.memory.labs).length >= 3) {
                        simpleAllies.start()
                        for (base of bases) {
                                if (base == roomMineral) continue
                                if (Game.market.credits && terminal.store[base] < this.minAmount && this.buyFromFreeMarket(base, this.minAmount - terminal.store[base])) return;
                                if (terminal.store[base] < this.minAmount) {
                                        simpleAllies.requestResource(room.name, base, this.minAmount - terminal.store[base], 0.4);
                                        // console.log("requesting",this.minAmount - terminal.store[base],base+" from allies at priority",0.4);
                                }
                        }
                        simpleAllies.end()
                }
                
        }

        tradeToAllies(room, terminal, resource, max) {
                let allyRequests = Memory.requests.trade;

                if (!allyRequests || !allyRequests[resource]) return false;

                let requests = allyRequests[resource].sort((a, b) => b.priority - a.priority);

                if (requests.length === 0) return false;

                let request = requests[0];
                let amount = Math.min(terminal.store[resource]-max, request.amount);
                
                let dealCost = Game.market.calcTransactionCost(amount, room.name, request.room);
                let energyAvailable = this.room.terminal.store[RESOURCE_ENERGY];
                if (dealCost > energyAvailable) {
                        amount = Math.floor(amount * (energyAvailable / dealCost));
                }
                if (amount > 0) {
                        console.log('Sending '+amount+" "+resource+' to '+request.room+' from priority '+request.priority+" request. trade cost "+dealCost+" energy");
                        terminal.send(resource,amount, request.room, 'Sending '+amount+" "+resource+' to '+request.room+' from priority '+request.priority+" request");
                        return true;
                }
                
                // allyRequests[resource].filter(request => console.log(JSON.stringify(request)))

                // let amount = Math.min()


                return false;
        }


        tradeWithAllies(room, terminal) {
                
                const unsortedResourceRequests = simpleAllies.allyRequests.filter(request => request.requestType == RequestType .RESOURCE)

                const resourceRequestsByPriority = unsortedResourceRequests.sort((a, b) => a.priority - b.priority)

                const resourceRequests = resourceRequestsByPriority.reverse()

                // Iterate through resourceRequests

                for (const resourceRequest of resourceRequests) {

                        // Iterate if there is no requested amount
                        if (!resourceRequest.maxAmount) continue


                        if (boosts.includes(resourceRequest.resourceType)) {
                                if (terminal.store.getUsedCapacity(resourceRequest.resourceType) < this.minAmount) continue
                                terminal.send(resourceRequest.resourceType, Math.min(resourceRequest.maxAmount, terminal.store.getUsedCapacity(resourceRequest.resourceType) - this.minAmount), resourceRequest.roomName, 'Sending boosts to ally')
                                console.log("Sending boosts to ally")
                                return
                        }

                        //

                        if (minerals.includes(resourceRequest.resourceType)) {
                                if (terminal.store.getUsedCapacity(resourceRequest.resourceType) < 20000) continue
                                terminal.send(resourceRequest.resourceType, Math.min(resourceRequest.maxAmount, terminal.store.getUsedCapacity(resourceRequest.resourceType) - this.minAmount), resourceRequest.roomName, 'Sending minerals to ally')
                                console.log("Sending minerals to ally")
                                return
                        }

                        //

                        if (resourceRequest.resourceType == RESOURCE_ENERGY) {
                                if (!room.storage && room.storage.store.getUsedCapacity(resourceRequest.resourceType) < 80000) continue
                                terminal.send(resourceRequest.resourceType, Math.min(resourceRequest.maxAmount, terminal.store.getUsedCapacity(resourceRequest.resourceType) - 10000), resourceRequest.roomName, 'Sending energy to ally')
                                console.log("Sending energy to ally")
                                return
                        }
                }
        }

        sellToFreeMarket(resource, amount) {
                console.log('attempting to sell ' + amount, resource + ' to free market');
                amount = _.min([amount, this.room.terminal.store[resource]]);
                let minPrice = null;
                let history = Game.market.getHistory(resource);
                let lastDay = history[history.length - 1];

                if (lastDay) {
                        minPrice = lastDay.avgPrice - (allowedSalesHistoryDeviation * lastDay.stddevPrice);
                } else {
                        let sales = Game.market.getAllOrders((o) => o.type == "sell" && o.resourceType == resource && o.remainingAmount > 100);
                        if (sales.length > 0) {
                                minPrice = _.min(sales, 'price').price * allowedBuySellPriceRatio;
                        }
                }

                if (!minPrice) {
                        console.log(`Could not determine minimum price for ${resource}. Giving up.`);
                        return false;
                }

                let buyers = _.filter(Game.market.getAllOrders({ type: "buy", resourceType: resource }), (o) => o.amount > 0 && o.price >= minPrice);
                console.log(JSON.stringify(buyers), "at", minPrice);
                buyers = _.sortBy(buyers, (b) => Game.map.getRoomLinearDistance(b.roomName, this.room.name, true));

                let buyer = _.sortBy(buyers, (b) => -b.price).shift();
                if (!buyer) {
                        console.log(`No buyer found for ${resource} at ${minPrice}. Giving up.`);
                        return false;
                }

                let dealAmount = Math.min(amount, buyer.amount);
                let dealCost = Game.market.calcTransactionCost(dealAmount, this.room.name, buyer.roomName);
                let energyAvailable = this.room.terminal.store[RESOURCE_ENERGY];
                if (dealCost > energyAvailable) {
                        dealAmount = Math.floor(dealAmount * (energyAvailable / dealCost));
                }

                Game.market.deal(buyer.id, dealAmount, this.room.name);
                return true;
        }

        buyFromFreeMarket(resource, amount) {
                let minPrice = null;
                let history = Game.market.getHistory(resource);
                let lastDay = history[history.length - 1];

                if (lastDay) {
                        minPrice = lastDay.avgPrice + (allowedSalesHistoryDeviation * lastDay.stddevPrice);
                } else {
                        let sales = Game.market.getAllOrders((o) => o.type == "sell" && o.resourceType == resource && o.remainingAmount > 100);
                        if (sales.length > 0) {
                                minPrice = _.min(sales, 'price').price * allowedBuySellPriceRatio;
                        }
                }

                if (!minPrice) {
                        console.log(`Could not determine minimum price for ${resource}. Giving up.`);
                        return false;
                }

                let sellers = _.filter(Game.market.getAllOrders({ type: "sell", resourceType: resource }), (o) => o.amount > 0 && o.price <= minPrice);
                sellers = _.sortBy(sellers, (b) => Game.map.getRoomLinearDistance(b.roomName, this.room.name, true));


                let seller = _.sortBy(sellers, (b) => b.price).shift();

                console.log(seller);

                if (!seller) {
                        console.log(`No seller found for ${resource} at ${minPrice}. Giving up.`);
                        return false;
                }

                let dealAmount = Math.min(amount, seller.amount);
                let dealCost = Game.market.calcTransactionCost(dealAmount, this.room.name, seller.roomName);
                let energyAvailable = this.room.terminal.store[RESOURCE_ENERGY];
                if (dealCost > energyAvailable) {
                        dealAmount = Math.floor(dealAmount * (energyAvailable / dealCost));
                }
                Game.market.deal(seller.id, dealAmount, this.room.name);
                return true;
        }

        tradeToOtherRooms(room, roomTerminal, roomMineral) {

                let terminals = Object.values(Game.structures).filter(structure => structure.structureType === STRUCTURE_TERMINAL && structure !== roomTerminal && structure.store[roomMineral] < this.minAmount);
                terminals.forEach(terminal => {
                        if (roomTerminal.send(roomMineral, roomTerminal.store[roomMineral]-this.minAmount, terminal.room.name, 'balancing script') === OK) return true;
                });
                return false
        }

        tradeExcessEnergy(room, roomTerminal) {
                let terminals = Object.values(Game.structures).filter(structure => structure.structureType === STRUCTURE_TERMINAL && structure !== roomTerminal && structure.store[RESOURCE_ENERGY] < 25000);
                terminals.forEach(terminal => {
                        console.log(terminal)
                        if (terminal.store[RESOURCE_ENERGY] < 25000) {
                                console.log("sending", roomTerminal.store[RESOURCE_ENERGY]/10,"energy to", terminal.room.name)
                                if (roomTerminal.send(RESOURCE_ENERGY, roomTerminal.store[RESOURCE_ENERGY]/10, terminal.room.name, 'balancing script') === OK) return true;
                        }
                });

                // for (let target in Memory.)
        }

        getIngredients(commodity, obj, number) {
                if (!COMMODITIES[commodity]) {
                        return ('unknown commodity at get ingredients');
                }
                if (!number) {
                        number = 1
                }
                let amount = number
                if (!obj[commodity]) {
                        obj[commodity] = amount
                } else {
                        obj[commodity] += amount
                }
                for (let i in baseIngredients) {
                        if (baseIngredients[i] === commodity) {
                                return
                        }
                }
                let comps = COMMODITIES[commodity].components;
                for (let i in comps) {
                        let component = i;
                        let amount = comps[i] * (number / COMMODITIES[commodity].amount)
                        if (COMMODITIES[component]) {
                                getIngredients(component, obj, amount)
                        } else {
                                //base level commodity
                                if (!obj[i]) {
                                        obj[i] = amount
                                } else {
                                        obj[i] += amount
                                }
                        }
                }
                return obj;
        }
}