module.exports = class Links {
    constructor(room) {
        if(!room.memory.links) {
            room.memory.links = {
                cache: {}
            };
        }
        this.room = room;
        this.memory = room.memory;
        this.requests = [];
    }
    
    storage() {
        if(!this.room.storage) return null;
        return this.linkAt(this.room.storage);
    }

    terminal() {
        if(!this.room.terminal) return null;
        return this.linkAt(this.room.terminal);
    }

    sources() {
        let sources = this.room.find(FIND_SOURCES);
        return _.compact(_.map(sources, (s) => this.linkAt(s)));
    }


    availableSenderLinks() {
        let result = this.sources();
        if(this.storage()) result.push(this.storage());

        return _.sortBy(_.filter(result, (l) => l.cooldown === 0), (l) => -l.store.energy);
    }

    linkAt(target) {

        return(target.pos.findInRange(FIND_MY_STRUCTURES, 2).filter(a => a.structureType == STRUCTURE_LINK)[0]);
        // let linkId = this.memory.links.cache[target.id];
        // if(_.isNumber(linkId) && Game.time < linkId) return;

        // let link = Game.getObjectById(linkId);
        // if(link) return link;

        // link = logistic.storeFor(target, false, STRUCTURE_LINK);
        // if(link) {
        //     this.memory.links.cache[target.id] = link.id;
        // } else {
        //     this.memory.links.cache[target.id] = Game.time + 40;
        // }

        // return link;


    }

    requestEnergy(link, priority) {
        this.requests.push({ link: link, priority: priority });
    }

    checkOpenRequests() {
        return this.memory.pendingRequests;
    }

    fullfillRequests() {
        let receiver = _.sortBy(this.requests, (req) => -req.priority)[0];
        if(receiver) {
            receiver = receiver.link;
            this.memory.pendingRequests = true;
        } else {
            // if there are no other requests, we transfer to the storage
            // avoiding minuscle transfers, to keep cooldown pressure low
            if(this.storage() && this.storage().store.getFreeCapacity(RESOURCE_ENERGY) >= 400) {
                receiver = this.storage();
            }
            else if(this.terminal() && this.terminal().store.getFreeCapacity(RESOURCE_ENERGY) >= 400) {
                receiver = this.terminal();
            }
            this.memory.pendingRequests = false;
        }

        if(!receiver) return;

        let sender = _.filter(this.availableSenderLinks(), (l) => l !== receiver)[0];
        if(!sender) return;

        if(sender.store.energy >= 400 && receiver.store.getFreeCapacity(RESOURCE_ENERGY) >= sender.store.energy) {
            sender.transferEnergy(receiver);
        }
    }


    // storage() {
    //     if(!this.room.storage) return null;
    //     return this.linkAt(this.room.storage);
    // }



}