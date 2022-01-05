// trading config
const maxPrice = 3.6;

const bases = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];


const allowedSalesHistoryDeviation = 0.5;
const rawCommodities = [RESOURCE_MIST, RESOURCE_BIOMASS, RESOURCE_METAL, RESOURCE_SILICON];
const refinedCommodities = Object.keys(COMMODITIES).filter((r) => r.length > 1 && !rawCommodities.includes(r) && r != "energy");

const reactions = {
    // Base compounds
    "UL": { "minPrice": maxPrice * 2, "partOne": RESOURCE_UTRIUM, "partTwo": RESOURCE_LEMERGIUM }, 
    "ZK": { "minPrice": maxPrice * 2, "partOne": RESOURCE_ZYNTHIUM, "partTwo": RESOURCE_KEANIUM },
    "G": { "minPrice": maxPrice * 4, "partOne": RESOURCE_ZYNTHIUM_KEANITE, "partTwo": RESOURCE_UTRIUM_LEMERGITE },
    "OH": { "minPrice": maxPrice * 2, "partOne": RESOURCE_OXYGEN, "partTwo": RESOURCE_HYDROGEN },

    // Tier 1 compounds
    "UH": { "minPrice": maxPrice * 2, "partOne": RESOURCE_UTRIUM, "partTwo": RESOURCE_HYDROGEN },
    "KH": { "minPrice": maxPrice * 2, "partOne": RESOURCE_KEANIUM, "partTwo": RESOURCE_HYDROGEN },
    "GH": { "minPrice": maxPrice * 5, "partOne": RESOURCE_GHODIUM, "partTwo": RESOURCE_HYDROGEN },
    "LH": { "minPrice": maxPrice * 2, "partOne": RESOURCE_LEMERGIUM, "partTwo": RESOURCE_HYDROGEN },
    "ZH": { "minPrice": maxPrice * 2, "partOne": RESOURCE_ZYNTHIUM, "partTwo": RESOURCE_HYDROGEN },
    "KO": { "minPrice": maxPrice * 2, "partOne": RESOURCE_KEANIUM, "partTwo": RESOURCE_OXYGEN },
    "LO": { "minPrice": maxPrice * 2, "partOne": RESOURCE_LEMERGIUM, "partTwo": RESOURCE_OXYGEN },
    "ZO": { "minPrice": maxPrice * 2, "partOne": RESOURCE_ZYNTHIUM, "partTwo": RESOURCE_OXYGEN },
    "UO": { "minPrice": maxPrice * 2, "partOne": RESOURCE_UTRIUM, "partTwo": RESOURCE_OXYGEN },
    "GO": { "minPrice": maxPrice * 5, "partOne": RESOURCE_GHODIUM, "partTwo": RESOURCE_OXYGEN },

    // Tier 2 compounds
    "UH2O": { "minPrice": maxPrice * 4, "partOne": RESOURCE_UTRIUM_HYDRIDE, "partTwo": RESOURCE_HYDROXIDE },
    "UHO2": { "minPrice": maxPrice * 4, "partOne": RESOURCE_UTRIUM_OXIDE, "partTwo": RESOURCE_HYDROXIDE },
    "KH2O": { "minPrice": maxPrice * 4, "partOne": RESOURCE_KEANIUM_HYDRIDE, "partTwo": RESOURCE_HYDROXIDE },
    "KHO2": { "minPrice": maxPrice * 4, "partOne": RESOURCE_KEANIUM_OXIDE, "partTwo": RESOURCE_HYDROXIDE },
    "LH2O": { "minPrice": maxPrice * 4, "partOne": RESOURCE_LEMERGIUM_HYDRIDE, "partTwo": RESOURCE_HYDROXIDE },
    "LHO2": { "minPrice": maxPrice * 4, "partOne": RESOURCE_LEMERGIUM_OXIDE, "partTwo": RESOURCE_HYDROXIDE },
    "ZH2O": { "minPrice": maxPrice * 4, "partOne": RESOURCE_ZYNTHIUM_HYDRIDE, "partTwo": RESOURCE_HYDROXIDE },
    "ZHO2": { "minPrice": maxPrice * 4, "partOne": RESOURCE_ZYNTHIUM_OXIDE, "partTwo": RESOURCE_HYDROXIDE },
    "GH2O": { "minPrice": maxPrice * 5, "partOne": RESOURCE_GHODIUM_HYDRIDE, "partTwo": RESOURCE_HYDROXIDE },
    "GHO2": { "minPrice": maxPrice * 5, "partOne": RESOURCE_GHODIUM_OXIDE, "partTwo": RESOURCE_HYDROXIDE },

    // Tier 3 compounds
    "XZHO2": { "minPrice": maxPrice * 105, "partOne": RESOURCE_ZYNTHIUM_ALKALIDE, "partTwo": RESOURCE_CATALYST },
    "XGH2O": { "minPrice": maxPrice * 66, "partOne": RESOURCE_GHODIUM_ACID, "partTwo": RESOURCE_CATALYST },
    "XUH2O": { "minPrice": maxPrice * 64, "partOne": RESOURCE_UTRIUM_ACID, "partTwo": RESOURCE_CATALYST },
    "XUHO2": { "minPrice": maxPrice * 64, "partOne": RESOURCE_UTRIUM_ALKALIDE, "partTwo": RESOURCE_CATALYST },
    "XKH2O": { "minPrice": maxPrice * 64, "partOne": RESOURCE_KEANIUM_ACID, "partTwo": RESOURCE_CATALYST },
    "XKHO2": { "minPrice": maxPrice * 64, "partOne": RESOURCE_KEANIUM_ALKALIDE, "partTwo": RESOURCE_CATALYST },
    "XLH2O": { "minPrice": maxPrice * 65, "partOne": RESOURCE_LEMERGIUM_ACID, "partTwo": RESOURCE_CATALYST },
    "XLHO2": { "minPrice": maxPrice * 75, "partOne": RESOURCE_LEMERGIUM_ALKALIDE, "partTwo": RESOURCE_CATALYST },
    "XZH2O": { "minPrice": maxPrice * 65, "partOne": RESOURCE_ZYNTHIUM_ACID, "partTwo": RESOURCE_CATALYST },
    "XGHO2": { "minPrice": maxPrice * 66, "partOne": RESOURCE_GHODIUM_ALKALIDE, "partTwo": RESOURCE_CATALYST }
}

module.exports = class Trading {
    constructor(room) {
        this.room = room;
        this.toSell = room.memory.mineralsTypes;
        this.sellingBlacklist = [RESOURCE_ENERGY, "XGHO2", "XGH2O", "XKHO2", "XKH2O","XLHO2", "XLH2O", "XUHO2", "XUH2O", "XZHO2", "XZH2O", "G", "OH"];
        this.minAmount = 5000;
    }


    runTerminal() {
        if (!this.room.terminal) return;
        // console.log(this.room.storage[RESOURCE_ENERGY])
        // if (this.room.storage[RESOURCE_ENERGY] == 10046) console.log('yet')
        // console.log(this.room.terminal.store);
        if (Game.time+25 % 100 == 0 && this.isTradingPossible() && this.cooldown() == 0) {
            this.excessEnergy();
    
            this.toSell.forEach(element => {
                if (this.room.terminal.store[element] > this.minAmount && !this.sellingBlacklist.includes(element)) {
                    this.sellToFreeMarket(element, this.room.terminal.store[element]-this.minAmount);
                }
            });
            
        }
    }

    excessEnergy() {
        if(this.room.terminal.store[RESOURCE_ENERGY] > 20000) {
            this.sellToFreeMarket(RESOURCE_ENERGY, this.room.terminal.store[RESOURCE_ENERGY]/2);   
        }
    }

    get terminalEnergyBuffer() {
        return 110000;
    }

    cooldown() {
        return this.room.terminal.cooldown;
    }

    isTradingPossible() {
        return this.room.terminal;
    }

    minimumExportAmount(resource) {
        if(resource === RESOURCE_ENERGY) return 500;
        if(resource === RESOURCE_POWER) return 10;
        if(refinedCommodities.includes(resource)) return 10;

        return 100;
    }

    sellToFreeMarket(resource, amount) {
        amount = _.min([amount, this.room.terminal.store[resource]]);
        if(amount < this.minimumExportAmount(resource)) return false;
        let minPrice = null;
        let history = Game.market.getHistory(resource);
        let lastDay = history[history.length - 1];

        if(lastDay) {
            minPrice = lastDay.avgPrice - (allowedSalesHistoryDeviation * lastDay.stddevPrice);
        } else {
            let sales = Game.market.getAllOrders((o) => o.type == "sell" && o.resourceType == resource && o.remainingAmount > 100);
            if(sales.length > 0) {
                minPrice = _.min(sales, 'price').price * allowedBuySellPriceRatio;
            }
        }

        if(!minPrice) {
            console.log(`Could not determine minimum price for ${resource}. Giving up.`);
            return false;
        }

        let buyers = _.filter(Game.market.getAllOrders({ type: "buy", resourceType: resource }), (o) => o.amount > 0 && o.price >= minPrice);
        buyers = _.sortBy(buyers, (b) => Game.map.getRoomLinearDistance(b.roomName, this.room.name, true));

        let buyer = _.sortBy(buyers, (b) => -b.price).shift();
        if(!buyer) return false;

        let dealAmount = Math.min(amount, buyer.amount);
        let dealCost = Game.market.calcTransactionCost(dealAmount, this.room.name, buyer.roomName);
        let energyAvailable = this.room.terminal.store[RESOURCE_ENERGY];
        if(dealCost > energyAvailable) {
            dealAmount = Math.floor(dealAmount * (energyAvailable / dealCost));
        }

        Game.market.deal(buyer.id, dealAmount, this.room.name);
        return true;
    }

    
    buyFromFreeMarket(resource, amount) {
        // let minPrice = null;
        // let history = Game.market.getHistory(resource);
        // let lastDay = history[history.length - 1];

        // if(lastDay) {
        //     minPrice = lastDay.avgPrice - (allowedSalesHistoryDeviation * lastDay.stddevPrice);
        // } else {
        //     let sales = Game.market.getAllOrders((o) => o.type == "sell" && o.resourceType == resource && o.remainingAmount > 100);
        //     if(sales.length > 0) {
        //         minPrice = _.min(sales, 'price').price * allowedBuySellPriceRatio;
        //     }
        // }

        // if(!minPrice) {
        //     console.log(`Could not determine minimum price for ${resource}. Giving up.`);
        //     return false;
        // }

        // let sellers = _.filter(Game.market.getAllOrders({ type: "sell", resourceType: resource }), (o) => o.amount > 0 && o.price <= minPrice);
        // sellers = _.sortBy(sellers, (b) => Game.map.getRoomLinearDistance(b.roomName, this.room.name, true));

        // console.log(JSON.stringify(sellers))
        // let seller = _.sortBy(sellers, (b) => b.price).shift();

        // console.log('seller', seller)
        // if(!seller) return false;

        // let dealAmount = Math.min(amount, seller.amount);
        // let dealCost = Game.market.calcTransactionCost(dealAmount, this.room.name, buyer.roomName);
        // let energyAvailable = this.room.terminal.store[RESOURCE_ENERGY];
        // if(dealCost > energyAvailable) {
        //     dealAmount = Math.floor(dealAmount * (energyAvailable / dealCost));
        // }

        // console.log(buyer.id, dealAmount, this.room.name)
        // Game.market.deal(buyer.id, dealAmount, this.room.name);
        // return true;



        for (var base in bases) {
            var element = bases[base];
            // console.log(Object.keys(room.terminal))
            if (this.room.terminal.cooldown == 0 && this.room.terminal.store[element] < this.minAmount) {
                var amountToBuy = this.minAmount - this.room.terminal.store[element];
                var orders = Game.market.getAllOrders(order => order.resourceType == element &&
                    order.type == ORDER_SELL &&
                    Game.market.calcTransactionCost(amountToBuy, this.room.name, order.roomName) < 3000);
                orders = orders.sort(function (a, b) { return a.price - b.price })
                if (orders[0] && orders[0].price < maxPrice) {
                    Game.market.deal(orders[0].id, amountToBuy, this.room.name);
                }
            }
            
        };
    }

    toString() {
        return "[Trading Manager Room " + this.room.name + "]";
    }

}