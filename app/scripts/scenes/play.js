'use strict';

const play = (PIXI) => {
    this.scene = new PIXI.Container();

    var title = new PIXI.Text('Domino Central', { fontFamily: 'Snippet', fontSize: '35px', fill: 'white', align: 'left' });
    title.position.x = (width()/2)-(title.width/2);
    title.position.y = (height()/2)-(title.height/2);
    const playerTexture = PIXI.Texture.fromImage('assets/player-face-1.png');
    const dominoTextures = {};
    const dominoes = [
        '0-0', '0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '1-0', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '3-0', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '4-0', '4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '5-0', '5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '6-0', '6-1', '6-2', '6-3', '6-4', '6-5', '6-6'
    ];
    const draw = () => {
        const hand = [];
        for (let i = 0; i < 7; i++) {
            const choice = Math.floor(Math.random() * dominoes.length);
            const dominoe = dominoes.splice(choice, 1)[0];
            let index = 99999999;
            const parts = dominoe.split('-');
            for (let x = 0; x < dominoes.length; x++) {
                if (parts[0] === parts[1]) {
                    break;
                }
                if (dominoes[x] === `${parts[1]}-${parts[0]}`) {
                    index = x;
                }
            }
            dominoes.splice(index, 1);
            hand.push(dominoe);
        }
        return hand;
    };

    dominoes.forEach((domino) => {
        dominoTextures[domino] = PIXI.Texture.fromImage(`assets/dominoes/${domino}.png`);
    });

    const showDominoes = (hand) => {
        let xStart = (width()/2)-((65*6)/2);
        hand.forEach((domino) => {
            const sprite = new PIXI.Sprite(dominoTextures[domino]);
            sprite.inHand = true;
            sprite.height = 100;
            sprite.width = 60;
            sprite.position.x = xStart;
            sprite.position.y = height()-60;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this.scene.addChild(sprite);
            xStart+=65;
        });
    };

    const backTexture = PIXI.Texture.fromImage('assets/dominoes/back.png');

    const showDominowBack = (hand, x, y, angle) => {
        if (!x) {
            x = (width()/2)-((65*hand.length)/2);
        }
        if (!y) {
            y = (height()/2)-((65*hand.length)/2);
        }
        let xStart = x;
        let yStart = y;

        hand.forEach((domino) => {
            const texture = dominoTextures[domino];
            const sprite = new PIXI.Sprite(texture);
            //const sprite = new PIXI.Sprite(backTexture);
            sprite.inHand = true;
            sprite.domino = domino;
            sprite.height = 100;
            sprite.width = 60;
            sprite.position.x = angle ? x : xStart;
            sprite.position.y = angle ? yStart : y;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            if (angle) {
               sprite.rotation += angle;
            }
            this.scene.addChild(sprite);
            xStart+=65;
            yStart+=65;
        });
    };

    scene.renderPlayers = (userAlias) => {
        const players = [
            { alias: 'Rohan Malcolm', image: 'player-face-1.png' },
            { alias: 'Test 1' },
            { alias: 'Test 2' },
            { alias: 'Test 3' },
        ];

        const showPlayer = (playerName, image, x, y, angle) => {
            const name = new PIXI.Text(playerName, { fontFamily: 'Snippet', fontSize: '20px', fill: 'white', align: 'left' });
            name.position.x = x - (name.width/2);
            name.position.y = y;
            if (angle) {
               name.rotation += angle;
               name.position.y = y + (name.width/2);
            } 
            this.scene.addChild(name);
        };

        const left = () => {
            showPlayer(players[0].alias, players[0].image, 80, (height()/2)-50, -1.56);
        };

        const right = () => {
            showPlayer(players[1].alias, players[0].image, width()-20, (height()/2)-50, -1.56);
        };

        const top = () => {
            showPlayer(players[2].alias, players[0].image, width()/2, 10);
        };

        left();
        right();
        top();

        const aliasText = new PIXI.Text(`User: ${userAlias}`, { fontFamily: 'Snippet', fontSize: '25px', fill: 'white', align: 'left' });

        aliasText.position.x = width()-160;
        aliasText.position.y = height()-30;
        this.scene.addChild(aliasText);

        const hand = draw();
        this.scene.playerHand = hand;
        showDominoes(hand);

        const leftHand = draw();
        this.scene.leftPlayerHand = leftHand;
        const rightHand = draw();
        this.scene.rightPlayerHand = rightHand;
        const topHand = draw();
        this.scene.topPlayerHand = topHand;

        showDominowBack(topHand, null, 80);
        showDominowBack(leftHand, 90, null, -1.56);
        showDominowBack(rightHand, width()-100, null, -1.56);
    };

    const putDominoOnBoard = (domino, x, y, angle) => {
        const dominoHeight = 65;
        const dominoWidth = 30;
        const texture = dominoTextures[domino];
        const sprite = new PIXI.Sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.height = dominoHeight;
        sprite.width = dominoWidth;
        sprite.onBoard = true;
        if (angle) {
           sprite.rotation += angle;
        }
        this.scene.addChild(sprite);
        if (!this.scene.endPoints) {
            if (domino === '0-0' || domino === '1-1' || domino === '2-2' || domino === '3-3' || domino === '4-4' || domino === '5-5' || domino === '6-6' ) {
                const obj = {};
                const parts = domino.split('-');
                obj[`${parts[0]}0`] = {x:x, y:y+dominoHeight/4};
                obj[`${parts[1]}1`] = {x:x+dominoWidth, y:y+dominoHeight/4};
                this.scene.endPoints = obj;
            }
        } else {
            
        }
    };

    const getEndPointsXY = () => {
        const len = this.scene.children.length;

    };

    const updateHands = () => {
        for (let i = this.scene.children.length-1; i>=0; i--) {
            const child = this.scene.children[i];
            if (child.inHand) {
                this.scene.removeChild(child);
            }
        }
        showDominoes(this.scene.playerHand);
        showDominowBack(this.scene.topPlayerHand, null, 80);
        showDominowBack(this.scene.leftPlayerHand, 90, null, -1.56);
        showDominowBack(this.scene.rightPlayerHand, width()-100, null, -1.56);
    };

    this.scene.addChild(title);
    this.scene.putDominoOnBoard = putDominoOnBoard;
    this.scene.updateHands = updateHands;
    return this.scene;
};