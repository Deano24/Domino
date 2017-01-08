'use strict';

/**
 * Get the way the domino's need to be placed to be matched.
 * @param {Array} parts - The values at the two parts of the table.
 * @param {String} value - The value to be checked.
 * @return {String} The domino required to be played.
 */
const getMatchedDomino = (parts, value) => {
    let domino = '';
    if (parts[0] === value) {
        domino = parts[1]+'-'+parts[0];
    } else {
        domino = parts[0]+'-'+parts[1]; 
    }
    return domino;
};

const turnManager = {

    options: { lastPlayed: ['6-6','6-6'], poseLeft: true, poseRight: true},
    /**
     * handles the play by the user.
     * @param {Object} play - The play that should be made.
     */
    handlePlay (play) {
        const poseLeft = this.options.poseLeft;
        const poseRight = this.options.poseRight;
        if (poseLeft && play.side === BoardSides.LEFT){
            this.options.poseLeft = false;
        }
        if (poseRight && play.side === BoardSides.Right){
            this.options.poseRight = false;
        }
        this.options.passCount = 0;
        let angle = 1.565;
        let domino = play.domino;
        const loc = this.playScene.endPoints[play.side];
        let x = loc.x;
        let y = loc.y;
        let dominoHeight = 65;
        let dominoWidth = 30;
        if (play.side === BoardSides.RIGHT && !isDouble(domino)) {
            x+=65;
        }
        if (isDouble(domino)) {
            angle = null;
            y-=dominoHeight/4;
            if (play.side === BoardSides.LEFT) {
                x-=dominoWidth;
            }
        }
        if (!poseLeft && play.side === BoardSides.LEFT && isDouble(this.options.lastPlayed[play.side])) {
            x+=dominoWidth;
            y+=dominoHeight/4;
        }
        if (play.side !== play.dominoSide) {
            domino = domino.split('-').reverse().join('-');
        }
        const boardOptions = {side: play.side};
        if (play.side === BoardSides.LEFT) {
            const parts = domino.split('-');
            if (!this.options.turnedUp) {
                if (x-dominoHeight < this.playScene.playingArea[0]) {
                    this.options.turnedUp = true;
                    angle = null;
                    domino = getMatchedDomino(parts, play.match);
                    y -= dominoHeight;
                    if (isDouble(domino)) {
                        x+=dominoWidth;
                        y+=dominoWidth/2;
                        this.options.incrementY = dominoWidth/2;
                    }
                    if (isDouble(this.options.lastPlayed[play.side])) {
                        y -= dominoWidth/2;
                    }
                    this.options.leftTurned = 1;
                }
            } else {
                x = loc.x+dominoWidth;
                if (isDouble(domino)) {
                    angle = 1.565;
                    y += dominoWidth*1.7;
                    x += dominoWidth*1.6;
                } else {
                    angle = null;
                }
                domino = getMatchedDomino(parts, play.match);
                y -= dominoHeight;
                if (isDouble(this.options.lastPlayed[play.side])) {
                    y -= dominoWidth/2;
                    x -= dominoWidth/3;
                    if (this.options.leftTurned === 1) {
                        x += dominoWidth/3;
                    }
                }
                this.options.leftTurned++;
                let checkY = y;
                if (isDouble(domino) && this.options.completeTurnLeft){
                    checkY -= dominoHeight;
                }
                if (checkY < this.playScene.playingArea[1]) {
                    angle = 1.565;
                    y = loc.y;
                    x = loc.x+(dominoHeight*2);
                    if (isDouble(this.options.lastPlayed[play.side])) {
                        x -= dominoWidth/5;
                        y += dominoWidth/2;
                        if (this.options.justCompleteTurn) {
                            y -= dominoWidth/2;
                            x += dominoWidth/5;
                        }
                    }
                    if (!this.options.completeTurnLeft) {
                        this.options.completeTurnLeft = true;
                        this.options.justCompleteTurn = true;
                        x -= 5;
                        if (isDouble(this.options.lastPlayed[play.side])) {
                            x += dominoWidth/3;
                            y -= dominoWidth/2;
                        }
                    } else {
                        this.options.justCompleteTurn = false;
                        if (isDouble(domino)) {
                            x -= dominoHeight;
                            y -= (dominoWidth/2);
                            angle = null;
                        }
                    }
                }
            }
        } else if (play.side === BoardSides.RIGHT) {
            if (isDouble(this.options.lastPlayed[play.side]) && this.options.lastPlayed[play.side] !== '6-6') {
                y += 15;
            }
            const parts = domino.split('-');
            if (!this.options.turnedDown) {
                if (x > this.playScene.playingArea[2]) {
                    this.options.turnedDown = true;
                    angle = null;
                    domino = getMatchedDomino(parts, play.match).split('-').reverse().join('-');
                    x -= dominoHeight;
                    if (isDouble(this.options.lastPlayed[play.side])) {
                        y += dominoHeight*0.80;
                        x -= dominoWidth;
                    }
                }
            } else if (this.options.turnedDown) {
                angle = null;
                y += dominoHeight;
                x = loc.x;
                domino = getMatchedDomino(parts, play.match).split('-').reverse().join('-');
                if (isDouble(domino)) {
                    y += 15;
                    x += dominoWidth*1.6;
                    angle = 1.565;
                }
                if (isDouble(this.options.lastPlayed[play.side])) {
                    y -= dominoWidth*1.7;
                    x -= dominoWidth*3.75;
                }
                let checkY = y;
                if (isDouble(this.options.lastPlayed[play.side]) && this.options.completeTurnRight) {
                    checkY += dominoHeight;
                }
                if (checkY > this.playScene.playingArea[3]) {
                    angle = 1.565;
                    y = loc.y;
                    x = loc.x-dominoHeight;
                    if (!this.options.completeTurnRight) {
                        this.options.completeTurnRight = true;
                        this.options.justTurnRight = true;
                        y = loc.y+dominoWidth;
                        x = loc.x;
                        if (isDouble(this.options.lastPlayed[play.side])) {
                            y -= dominoWidth;
                            x -= dominoHeight*2;
                        }
                    } else {
                        if (isDouble(domino)) {
                            angle = null;
                            y -= dominoWidth/2;
                            x -= dominoWidth;
                        }
                        if (isDouble(this.options.lastPlayed[play.side]) && this.options.justTurnRight) {
                            x -= dominoHeight;
                        } else if (isDouble(this.options.lastPlayed[play.side])) {
                            y += dominoWidth/2;
                            x += (dominoHeight/2)+3;
                        }
                        this.options.justTurnRight = false;
                    }
                }
            }
        }
        this.options.lastPlayed[play.side] = play.domino;
        this.playScene.putDominoOnBoard(domino, x, y, angle, boardOptions);
        updateRender();
    }
};

