const simpleAllies = require('simpleAllies')

const RequestType  = {
    RESOURCE: 0,
    DEFENSE: 1,
    ATTACK: 2,
    EXECUTE: 3,
    HATE: 4,
}

module.exports = {
    run() {
        if (!Memory.requests) {
            Memory.requests = { trade: {} };
        }
    
        simpleAllies.start();
        simpleAllies.checkAllies(request => this.handleRequest(request));
        // this.makeResourceRequests();
        simpleAllies.end();
    },
    
    handleRequest(request) {
        if (request.requestType === RequestType.RESOURCE) {
            if (!RESOURCES_ALL.includes(request.resourceType)) return;

            if (!Memory.requests.trade) {
                Memory.requests.trade = {};
            }

            if (!Memory.requests.trade[request.resourceType]) {
                Memory.requests.trade[request.resourceType] = [];
            }
            Memory.requests.trade[request.resourceType].push({
                amount: Math.min(request.maxAmount | 5000, 5000),
                room: request.roomName,
                lastSeen: Game.time,
                priority: 1 * request.priority,
            });
        }
    },
    
    requestResource(roomName, resourceType, maxAmount, priority) {
        simpleAllies.start();
        simpleAllies.requestResource(roomName, resourceType, maxAmount, priority)
        simpleAllies.end();
    }
}

