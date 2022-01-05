module.exports = {
    visual(room) {
        this.text('CPU', 44, 1, {align: 'left'});
        this.text('BKT', 44, 2, {align: 'left'})
        this.Rect(46, 1, 3, 1, {fill: 'transparent', stroke: '#202020'});
        this.Rect(46, 2, 3, 1, {fill: 'transparent', stroke: '#202020'});

    },


    Rect(x, y, width, height, style) {
        room.visual.rect(x-0.5, y-0.5, width, height, style);
    },
    text(text, x, y, style) {
        new RoomVisual().text(text, x-0.5, y+0.25, style);
    }
}