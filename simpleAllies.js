const swcSegmentId = 98;

const ALLIES = [
    'MarvinTMB',
    'Bycrome',
]
const logIncomingRequests = true

const RequestType = {
    RESOURCE: 0,
    DEFENSE: 1,
    ATTACK: 2,
    EXECUTE: 3,
    HATE: 4,
}
const RequestTypeStr = {
    [RequestType.RESOURCE]: 'RESOURCE',
    [RequestType.DEFENSE]: 'DEFENSE',
    [RequestType.ATTACK]: 'ATTACK',
    [RequestType.EXECUTE]: 'EXECUTE',
    [RequestType.HATE]: 'HATE'
};

/* 
requestType: number;
resourceType?: ResourceConstant;
playerName?: string;
maxAmount?: number;
roomName?: string;
priority: number;
timeout:number / Tick when it is obsolete
*/

let allyRequests
let requestArray

const simpleAllies = {

    checkAllies(callback) {
        let allies = [...ALLIES];
        let currentAllyName = allies[Game.time % ALLIES.length];

        if (allyRequests === undefined) {
            if (RawMemory.foreignSegment && RawMemory.foreignSegment.username === currentAllyName) {
                try {
                    allyRequests = JSON.parse(RawMemory.foreignSegment.data);
                }
                catch {
                    console.log('failed to parse', currentAllyName, 'request segment');
                    allyRequests = null;
                }
                if (allyRequests && _.isArray(allyRequests) && allyRequests.length > 0 && logIncomingRequests) {
                    let requestListStr = currentAllyName + ':<br/>';
                    for (let r of allyRequests) {
                        requestListStr += RequestTypeStr[r.requestType] + ' - ';
                        if (r.requestType === RequestType.RESOURCE)
                            requestListStr += 'resourceType: ' + r.resourceType + ', maxAmount: ' + r.maxAmount + ', room: ' + r.roomName + ', priority: ' + r.priority + '<br/>';
                        else if (r.requestType === RequestType.DEFENSE)
                            requestListStr += 'room: ' + r.roomName + ', priority: ' + r.priority + '<br/>';
                        else if (r.requestType === RequestType.ATTACK)
                            requestListStr += 'room: ' + r.roomName + ', priority: ' + r.priority + ', playerName: ' + r.playerName + '<br/>';
                        //else if (r.requestType === RequestType.EXECUTE)
                        //  requestListStr += 'priority: ' + r.priority + '<br/>';
                        else if (r.requestType === RequestType.HATE)
                            requestListStr += 'playerName: ' + r.playerName + ', priority: ' + r.priority + '<br/>';
                    }
                }
                else if (logIncomingRequests) {
                    let requestStr = currentAllyName + ':<br/>';
                    requestStr += RawMemory.foreignSegment.data;
                }
            }
            else {
                allyRequests = null;
                //console.log("Simple allies either has no segment or has the wrong name?");
            }
        }

        if (allyRequests) {
            for (let request of allyRequests) {
                callback(request);
            }
        }

        let nextAllyName = allies[(Game.time + 1) % ALLIES.length];
        RawMemory.setActiveForeignSegment(nextAllyName, swcSegmentId);
    },

    // Call before making any requests
    start() {
        requestArray = [];
        allyRequests = undefined;
    },

    // Call after making all your requests
    end() {
        RawMemory.segments[98] = JSON.stringify(requestArray);
        RawMemory.setPublicSegments([swcSegmentId]);
    },

    // Priority is unbounded. It's up to you and your allies to sort out what you want it to mean

    requestHelp(roomName, priority) {
        requestArray.push({
            requestType: RequestType.DEFENSE,
            roomName: roomName,
            priority: priority || 0
        });
    },

    requestResource(roomName, resourceType, maxAmount, priority) {
        requestArray.push({
            requestType: RequestType.RESOURCE,
            resourceType: resourceType,
            roomName: roomName,
            maxAmount: maxAmount,
            priority: priority || 0
        });
    },
}

module.exports = simpleAllies