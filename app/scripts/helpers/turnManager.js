'use strict';

/**
 * Gets the count in the user's hand.
 * @param {Array} hand - The user's hand.
 * @return {Integer} The total count in the user's hand.
 */
const getHandCount = (hand) => {
    let count = 0;
    hand.forEach((domino) => {
        const parts = domino.split('-');
        count += parseInt(parts[0]) + parseInt(parts[1]);
    });
    return count;
};

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

//keeps track of options
let globalOptions = {};
//keeps track of the current user's turn
let currentTurn;

const turnManager = {
    /**
     * Starts the domino game
     */
    start() {
        let player;
        const playerHand = this.playScene.player.hand;
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i] === '6-6') {
                playerHand.splice(i, 1);
                player = Player.RIGHT;
                break;
            }
        }
        const leftPlayerHand = this.playScene.leftPlayer.hand;
        for (let i = 0; i < leftPlayerHand.length; i++) {
            if (leftPlayerHand[i] === '6-6') {
                leftPlayerHand.splice(i, 1);
                player = Player.BOTTOM;
                break;
            }
        }
        const rightPlayerHand = this.playScene.rightPlayer.hand;
        for (let i = 0; i < rightPlayerHand.length; i++) {
            if (rightPlayerHand[i] === '6-6') {
                leftPlayerHand.splice(i, 1);
                player = Player.TOP;
                break;
            }
        }
        const topPlayerHand = this.playScene.topPlayer.hand;
        for (let i = 0; i < topPlayerHand.length; i++) {
            if (topPlayerHand[i] === '6-6') {
                topPlayerHand.splice(i, 1);
                player = Player.LEFT;
                break;
            }
        }
        this.playScene.putDominoOnBoard('6-6', width()/2,(height()/2 - 35), null, {pose: true});
        this.playScene.updateHands();
        this.next(player, { choices: ['6', '6'], passCount: 0, lastPlayed: ['6-6','6-6'], pose: true});
    },

    /**
     * Allows a user to play on the board.
     * @param {Object} play - The play that should be made.
     * @param {Object} options - Additional options to be passed to the function.
     */
    userPlay (play, options) {
        if (currentTurn !== Player.BOTTOM) {
            return;
        }
        if (play.match === -1) {
            options = globalOptions;
        }
        this.handlePlay(play, this.playScene.player.hand, this.playScene.player, Player.RIGHT, options);
    },

    /**
     * Allows the next player to play.
     * @param {Integer} player - The player to play.
     * @param {Object} options - Additional options to be passed to the function.
     */
    next (player, options) {
        currentTurn = player;
        globalOptions = options;
        let hand;
        let nextPlayer;
        let playerInfo;
        this.endPoints = this.playScene.endPoints;
        this.options = options;
        switch(player) {
            case Player.RIGHT:
                hand = this.playScene.rightPlayer.hand;
                nextPlayer = Player.TOP;
                playerInfo = this.playScene.rightPlayer;
                break;
            case Player.TOP:
                hand = this.playScene.topPlayer.hand;
                nextPlayer = Player.LEFT;
                playerInfo = this.playScene.topPlayer;
                break;
            case Player.LEFT:
                hand = this.playScene.leftPlayer.hand;
                nextPlayer = Player.BOTTOM;
                playerInfo = this.playScene.leftPlayer;
                break;
            case Player.BOTTOM:
                toastr.success('Your play!!');
                hand = this.playScene.player.hand;
                nextPlayer = Player.RIGHT;
                playerInfo = this.playScene.player;
                break;
        }
        if (player !== Player.BOTTOM) {
           setTimeout(() => {
                const play = ai.playDomino(hand, options.choices);
                this.handlePlay(play, hand, playerInfo, nextPlayer, options);
            }, 1000); 
       }
    },

    /**
     * handles the play by the AI or user.
     * @param {Object} play - The play that should be made.
     * @param {Array} hand - The players hand.
     * @param {Object} playerInfo - The player's information.
     * @param {Integer} nextPlayer - The next player.
     * @param {Object} options - Additional options to be passed to the function.
     */
    handlePlay (play, hand, playerInfo, nextPlayer, options) {
        const pose = options.pose;
        if (play.match !== -1) {
            options.pose = false;
            options.passCount = 0;
            hand.splice(play.idx, 1);
            let angle = 1.56;
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
            if (!pose && play.side === BoardSides.LEFT && isDouble(options.lastPlayed[play.side])) {
                x+=dominoWidth;
                y+=dominoHeight/4;
            }
            options.choices[play.side] = domino.split('-')[play.dominoSide === 1? 0 : 1];
            if (play.side !== play.dominoSide) {
                domino = domino.split('-').reverse().join('-');
            }
            const boardOptions = {side: play.side};
            if (play.side === BoardSides.LEFT) {
                const parts = domino.split('-');
                if (!options.turnedUp) {
                    if (x-dominoHeight < this.playScene.playingArea[0]) {
                        options.turnedUp = true;
                        angle = null;
                        domino = getMatchedDomino(parts, play.match);
                        y -= dominoHeight;
                        if (isDouble(domino)) {
                            x+=30;
                            y+=15;
                            options.incrementY = 15;
                        }
                        if (isDouble(options.lastPlayed[play.side])) {
                            y-=15;
                        }
                    }
                } else if (options.turnedUp) {
                    angle = null;
                    x = loc.x+dominoWidth;
                    if (isDouble(domino)) {
                        y+=15;
                    }
                    domino = getMatchedDomino(parts, play.match);
                    y -= dominoHeight;
                    if (isDouble(options.lastPlayed[play.side])) {
                        y-=15;
                    }
                    if (y < this.playScene.playingArea[1]) {
                        angle = 1.56;
                        y = loc.y;
                        x = loc.x+(dominoHeight*2);
                    }
                }
            } else if (play.side === BoardSides.RIGHT) {
                if (isDouble(options.lastPlayed[play.side]) && options.lastPlayed[play.side] !== '6-6') {
                    y+=15;
                }
                const parts = domino.split('-');
                if (!options.turnedDown) {
                    if (x > this.playScene.playingArea[2]) {
                        options.turnedDown = true;
                        angle = null;
                        domino = getMatchedDomino(parts, play.match).split('-').reverse().join('-');
                        x-=dominoHeight;
                        if (isDouble(options.lastPlayed[play.side])) {
                            y+=dominoHeight;
                            x-=dominoWidth;
                        }
                    }
                } else if (options.turnedDown) {
                    angle = null;
                    y += dominoHeight;
                    x = loc.x;
                    domino = getMatchedDomino(parts, play.match).split('-').reverse().join('-');
                    if (isDouble(domino)) {
                        y+=15;
                    }
                    if (isDouble(options.lastPlayed[play.side])) {
                        x-=dominoWidth;
                    }
                    if (y+dominoHeight > this.playScene.playingArea[3]) {
                        angle = 1.56;
                        y = loc.y;
                        x = loc.x-dominoHeight;
                        if (!options.completeTurn) {
                            options.completeTurn = true;
                            y = loc.y+dominoWidth;
                            x = loc.x;
                            if (isDouble(options.lastPlayed[play.side])) {
                                x = loc.x-dominoWidth;
                            }
                        }
                    }
                }
            }
            options.lastPlayed[play.side] = play.domino;
            this.playScene.putDominoOnBoard(domino, x, y, angle, boardOptions);
            this.playScene.updateHands();
            this.updateRender();
            if (hand.length === 0) {
                const win = toastr.success(`${playerInfo.name} wins the game. Click here to play again.`, 'Game Over', {timeOut: 0});
                return;
            }
        } else {
            if (options.passCount === 4){
                toastr.error('All player has passed. The player with the lowest total domino value wins.', 'Game Over', {timeOut: 0});
                const right = this.playScene.rightPlayer;
                right.value = getHandCount(right.hand);
                const left = this.playScene.leftPlayer;
                left.value = getHandCount(left.hand);
                const top = this.playScene.topPlayer;
                top.value = getHandCount(top.hand);
                const bottom = this.playScene.player;
                bottom.value = getHandCount(bottom.hand);
                var order = [{loc: 'right', value: right}, {loc: 'left', value: left}, {loc: 'top', value: top}, {loc: 'bottom', value: bottom}];
                order.sort(function(a, b){return a.value.value-b.value.value;});
                const win = toastr.success(`The winning player is: ${order[0].value.name} with a score of ${order[0].value.value}. Click here to play again.`, 'Game Over', {timeOut: 0});
                return;
            } else {
               options.passCount++;
                toastr.warning(`${playerInfo.name} passes.`); 
            }
        }
        this.next(nextPlayer, options);
    }
};

