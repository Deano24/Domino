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

/**
 * Builds the standings to show at the end of the game
 * @param  {Array} standings - The user standings
 */
const buildStanding = (standings) => {
    standings.sort(function(a, b){return b.score-a.score;});
    let standing = '<ul style="list-style-type: none;">';
    if (standings[0] > standings[1]) {
        standing += `<li>1. ${standings[0].info.name} - ${standings[0].score}</li>`;
        if (standings[1] > standings[2]) {
            standing += `<li>2. ${standings[1].info.name} - ${standings[1].score}</li>`;
            if (standings[2] > standings[3]) {
                standing += `<li>3. ${standings[2].info.name} - ${standings[2].score}</li>`;
                standing += `<li>4. ${standings[3].info.name} - ${standings[3].score}</li>`;
            } else {
                standing += `<li>3. ${standings[2].info.name} - ${standings[2].score}</li>`;
                standing += `<li>3. ${standings[3].info.name} - ${standings[3].score}</li>`;
            }
        } else if (standings[1] > standings[3]) {
            standing += `<li>2. ${standings[1].info.name} - ${standings[1].score}</li>`;
            standing += `<li>2. ${standings[2].info.name} - ${standings[2].score}</li>`;
            standing += `<li>3. ${standings[3].info.name} - ${standings[3].score}</li>`;
        } else {
            standing += `<li>2. ${standings[1].info.name} - ${standings[1].score}</li>`;
            standing += `<li>2. ${standings[2].info.name} - ${standings[2].score}</li>`;
            standing += `<li>2. ${standings[3].info.name} - ${standings[3].score}</li>`;
        }
    } else if (standings[0] > standings[2]) {
        standing += `<li>1. ${standings[0].info.name} - ${standings[0].score}</li>`;
        standing += `<li>1. ${standings[1].info.name} - ${standings[1].score}</li>`;
        if (standings[2] > standings[3]) {
            standing += `<li>2. ${standings[2].info.name} - ${standings[2].score}</li>`;
            standing += `<li>3. ${standings[3].info.name} - ${standings[3].score}</li>`;
        } else {
            standing += `<li>2. ${standings[2].info.name} - ${standings[2].score}</li>`;
            standing += `<li>2. ${standings[3].info.name} - ${standings[3].score}</li>`;
        }
    } else if (standings[0] > standings[3]) {
        standing += `<li>1. ${standings[0].info.name} - ${standings[0].score}</li>`;
        standing += `<li>1. ${standings[1].info.name} - ${standings[1].score}</li>`;
        standing += `<li>1. ${standings[2].info.name} - ${standings[2].score}</li>`;
        standing += `<li>2. ${standings[3].info.name} - ${standings[3].score}</li>`;
    } else {
        standing += `<li>1. ${standings[0].info.name} - ${standings[0].score}</li>`;
        standing += `<li>1. ${standings[1].info.name} - ${standings[1].score}</li>`;
        standing += `<li>1. ${standings[2].info.name} - ${standings[2].score}</li>`;
        standing += `<li>1. ${standings[3].info.name} - ${standings[3].score}</li>`;
    }
    standing += '</ul>';
    return standing;
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
                rightPlayerHand.splice(i, 1);
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
        this.next(player, { choices: ['6', '6'], passCount: 0, lastPlayed: ['6-6','6-6'], poseLeft: true, poseRight: true});
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
        if (player !== Player.BOTTOM || true) {
           setTimeout(() => {
                const play = ai.playDomino(hand, options.choices);
                if (play.domino === '6-6') {
                    return;
                }
                this.handlePlay(play, hand, playerInfo, nextPlayer, options);
            }, 100); 
       } else if (ai.playDomino(hand, options.choices).match === -1) {
            const play = ai.playDomino(hand, options.choices);
            this.handlePlay(play, hand, playerInfo, nextPlayer, options);
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
        const poseLeft = options.poseLeft;
        const poseRight = options.poseRight;
        if (play.match !== -1) {
            if (poseLeft && play.side === BoardSides.LEFT){
                options.poseLeft = false;
            }
            if (poseRight && play.side === BoardSides.Right){
                options.poseRight = false;
            }
            options.passCount = 0;
            hand.splice(play.idx, 1);
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
            if (!poseLeft && play.side === BoardSides.LEFT && isDouble(options.lastPlayed[play.side])) {
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
                        angle = 1.565;
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
                        angle = 1.565;
                        y = loc.y;
                        x = loc.x-dominoHeight;
                        if (!options.completeTurn) {
                            options.completeTurn = true;
                            y = loc.y+dominoWidth;
                            x = loc.x;
                            if (isDouble(options.lastPlayed[play.side])) {
                                x = loc.x-dominoWidth;
                            }
                        } else {
                            if (isDouble(options.lastPlayed[play.side])) {
                                x -= dominoHeight;
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
                let winner;
                switch (nextPlayer) {
                    case Player.RIGHT:
                        winner = Player.BOTTOM;
                        break;
                    case Player.TOP:
                        winner = Player.RIGHT;
                        break;
                    case Player.LEFT:
                        winner = Player.TOP;
                        break;
                    case Player.BOTTOM:
                        winner = Player.LEFT;
                        break;
                }
                this.playScene.scores[winner]++;
                const currentStandings = JSON.parse(JSON.stringify(this.playScene.scores));
                currentStandings[Player.RIGHT] = {score: currentStandings[Player.RIGHT], info: this.playScene.rightPlayer};
                currentStandings[Player.TOP] = {score: currentStandings[Player.TOP], info: this.playScene.topPlayer};
                currentStandings[Player.LEFT] = {score: currentStandings[Player.LEFT], info: this.playScene.leftPlayer};
                currentStandings[Player.BOTTOM] = {score: currentStandings[Player.BOTTOM], info: this.playScene.player};
                if (this.playScene.scores[winner] === 6 || (this.playScene.scores[0] > 0 && this.playScene.scores[1] > 0 && this.playScene.scores[2] > 0&& this.playScene.scores[3] > 0) ) {
                    handleGameOver(currentStandings);
                } else {
                    swal({
                        title: `Round Complete. ${playerInfo.name} wins the game`,
                        text: `The next round will start soon. The current standing is: ${buildStanding(currentStandings)}`,
                        timer: 5000,
                        showConfirmButton: false,
                        html: true
                    });
                    setTimeout(function() { restartGame();}, 7000); 
                }
                return;
            }
        } else {
            if (options.passCount === 3){
                const right = this.playScene.rightPlayer;
                right.value = getHandCount(right.hand);
                const left = this.playScene.leftPlayer;
                left.value = getHandCount(left.hand);
                const top = this.playScene.topPlayer;
                top.value = getHandCount(top.hand);
                const bottom = this.playScene.player;
                bottom.value = getHandCount(bottom.hand);
                const order = [{loc: 'right', value: right}, {loc: 'left', value: left}, {loc: 'top', value: top}, {loc: 'bottom', value: bottom}];
                order.sort(function(a, b){return a.value.value-b.value.value;});
                let winner;
                switch (order[0].loc) {
                    case 'bottom':
                        winner = Player.BOTTOM;
                        break;
                    case 'right':
                        winner = Player.RIGHT;
                        break;
                    case 'top':
                        winner = Player.TOP;
                        break;
                    case 'left':
                        winner = Player.LEFT;
                        break;
                }
                this.playScene.scores[winner]++;
                const currentStandings = JSON.parse(JSON.stringify(this.playScene.scores));
                currentStandings[Player.RIGHT] = {score: currentStandings[Player.RIGHT], info: this.playScene.rightPlayer};
                currentStandings[Player.TOP] = {score: currentStandings[Player.TOP], info: this.playScene.topPlayer};
                currentStandings[Player.LEFT] = {score: currentStandings[Player.LEFT], info: this.playScene.leftPlayer};
                currentStandings[Player.BOTTOM] = {score: currentStandings[Player.BOTTOM], info: this.playScene.player};
                if (this.playScene.scores[winner] === 6 || (this.playScene.scores[0] > 0 && this.playScene.scores[1] > 0 && this.playScene.scores[2] > 0&& this.playScene.scores[3] > 0) ) {
                    handleGameOver(currentStandings);
                } else {
                    swal({
                        title: `Round Complete. ${order[0].value.name} won with a score of ${order[0].value.value}`,
                        text: `The next round will start soon. The current standing is: ${buildStanding(currentStandings)}`,
                        timer: 5000,
                        showConfirmButton: false,
                        html: true
                    });
                    setTimeout(function() { restartGame();}, 7000); 
                }
                this.playScene.showHands();
                return;
            } else {
                options.passCount++;
                toastr.warning(`${playerInfo.name} passes.`); 
            }
        }
        this.next(nextPlayer, options);
    }
};

