module.exports = {
    run(room) {
        let flag = Game.flags[room.name+" NUKE"];
        let nuker = room.nuker();

        if (!flag) return;
        else if (!nuker) {
            console.log(room.name+" does not have a nuker to launch nuke");
            return;
        }
        // else if (!nuker.isActive()) {
        //     console.log(room.name+" is not ready to launch nuke");
        //     return;
        // }
        else {
            return("spawn");
        }
    },
    launch(room, flag) {
        console.log('LAUNCHING NUKE');
        // //     console.log('<span style="color:orange;">☢ NUKE LAUNCHED FROM [Room '+'<a href="#!/room/'+Game.shard.name+'/'+room.name+'">'+room.name+'</a>] to [Room '+'<a href="#!/room/'+Game.shard.name+'/'+flag.room.name+'">'+flag.room.name+'</a>]☢</span>')

        if (room.nuker().launchNuke(flag.pos) == OK) {
            console.log("nuke launch successful")
            flag.remove();
        }
        else {
            console.log("anomaly occured with nuke launch from"+room.name);
        }
        
    }
}