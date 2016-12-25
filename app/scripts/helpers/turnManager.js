'use strict';

const Player = {
    BOTTOM: 0,
    RIGHT: 1,
    TOP: 2,
    LEFT: 3
};
const turnManager = {
    start() {
        let player;
        const playerHand = this.playScene.playerHand;
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i] === '6-6') {
                playerHand.splice(i, 1);
                this.playScene.putDominoOnBoard('6-6', width()/2, (height()/2 - 35));
                this.updateRender();
                player = Player.BOTTOM;
                toastr.success('Your play!!');
                break;
            }
        }
        const leftPlayerHand = this.playScene.leftPlayerHand;
        for (let i = 0; i < leftPlayerHand.length; i++) {
            if (leftPlayerHand[i] === '6-6') {
                leftPlayerHand.splice(i, 1);
                this.playScene.putDominoOnBoard('6-6', width()/2,(height()/2 - 35));
                this.updateRender();
                player = Player.LEFT;
                break;
            }
        }
        const rightPlayerHand = this.playScene.rightPlayerHand;
        for (let i = 0; i < rightPlayerHand.length; i++) {
            if (rightPlayerHand[i] === '6-6') {
                leftPlayerHand.splice(i, 1);
                this.playScene.putDominoOnBoard('6-6', width()/2,(height()/2 - 35));
                this.updateRender();
                player = Player.RIGHT;
                break;
            }
        }
        const topPlayerHand = this.playScene.topPlayerHand;
        for (let i = 0; i < topPlayerHand.length; i++) {
            if (topPlayerHand[i] === '6-6') {
                topPlayerHand.splice(i, 1);
                this.playScene.putDominoOnBoard('6-6', width()/2,(height()/2 - 35));
                this.updateRender();
                player = Player.TOP;
                break;
            }
        }
        this.playScene.updateHands();
        this.next(player, ['6','6']);
    },
    next (player, options) {
        let hand;
        let nextPlayer;
        switch(player) {
            case Player.BOTTOM:
                hand = this.playScene.rightPlayerHand;
                nextPlayer = Player.RIGHT;
                break;
            case Player.RIGHT:
                hand = this.playScene.topPlayerHand;
                nextPlayer = Player.TOP;
                break;
            case Player.TOP:
                hand = this.playScene.leftPlayerHand;
                nextPlayer = Player.LEFT;
                break;
            case Player.LEFT:
                hand = this.playScene.playerHand;
                nextPlayer = Player.BOTTOM;
                break;
        }
        console.log(hand);
        console.log(options);
        const play = ai.playDomino(hand, options);
        if (play.match !== -1) {
            hand.splice(play.idx, 1);
            setTimeout(() => {
                console.log(`${play.side}${play.match}`);
                console.log(`${play.dominoSide}${play.match}`);
                const loc = this.playScene.endPoints[`${play.match}${play.side}`];
                let x = loc.x;
                let y = loc.y;
                let angle = 1.56;
                if (play.dominoSide !== play.side) {
                    angle = -angle;
                    y += 7.5;
                    x += 30;
                }
                this.playScene.putDominoOnBoard(play.domino, x, y, angle);
                this.updateRender();
                this.playScene.updateHands();
                this.next(nextPlayer, options);
            },1000);
        } else {
            this.next(nextPlayer, options);
            toastr.warning('This player passes.');
        }
    }
};

