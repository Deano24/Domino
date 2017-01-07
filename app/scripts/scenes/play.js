'use strict';
/**
 * The play screen for the application.
 * @param {Object} PIXI - PIXIJS framework
 * @return {Object} The scene to be displayed.
 */
const play = (PIXI) => {
    this.scene = new PIXI.Container();

    //keeps track of user scores
    this.scene.scores = [0, 0, 0, 0];

    //The title to be displayed on the board.
    var title = new PIXI.Text('Domino Central', { fontFamily: 'Snippet', fontSize: '35px', fill: 'white', align: 'left' });
    title.position.x = (width()/2)-(title.width/2);
    title.position.y = (height()/2)-(title.height/2);

    //Hash map containing textures for the dominos.
    const dominoTextures = {};

    //players
    const players = {};

    //List of possible dominos.
    const dominos = [
        '0-0', '0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '1-0', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '3-0', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '4-0', '4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '5-0', '5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '6-0', '6-1', '6-2', '6-3', '6-4', '6-5', '6-6'
    ];

    //Smaller list that the hands will be drawn from
    let dominoToDrawFrom = [
        '0-0', '0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '2-2', '2-3', '2-4', '2-5', '2-6', '3-3', '3-4', '3-5', '3-6', '4-4', '4-5', '4-6', '5-5', '5-6', '6-6'
    ];

    //The playing area that the dominos can be played on.
    this.scene.playingArea = [100, 100, (width()-100), (height()-130)];

    //loads the texture for each domino.
    dominos.forEach((domino) => {
        dominoTextures[domino] = PIXI.Texture.fromImage(`assets/dominos/${domino}.png`);
    });
    //texture for the back of the domino.
    const backTexture = PIXI.Texture.fromImage('assets/dominos/back.png');

    /**
     * Shows a player's name on the board
     * @param  {String} playerName - The players name
     * @param  {Integer} loc - The players location on the board
     * @param  {Integer} x - The x coordinate for the name
     * @param  {Integer} y - The y coordinate for the name
     * @param  {Float} angle - The angle the name should be rotated to
     */
    const showPlayer = (playerName, loc, x, y, angle) => {
        const name = new PIXI.Text(`${playerName} (${this.scene.scores[loc]})`, { fontFamily: 'Arvo', fontSize: '25px', fontStyle: 'bold', fill: 'black', align: 'center', stroke: 'yellow', strokeThickness: 2 });
        name.position.x = x - (name.width/2);
        name.position.y = y;
        if (angle) {
           name.rotation += angle;
           name.position.y = y - (name.width/2);
        } 
        name.playerName = true;
        this.scene.addChild(name);
    };

    /**
     * Creates the player's name who is on the left side of the game area
     */
    const left = () => {
        if (!players[Player.LEFT]) {
            return;
        }
        showPlayer(players[Player.LEFT].alias, Player.LEFT, 130, (height()/2), 1.565);
    };

    /**
     * Creates the player's name who is on the right side of the game area
     */
    const right = () => {
        if (!players[Player.RIGHT]) {
            return;
        }
        showPlayer(players[Player.RIGHT].alias, Player.RIGHT, width()-20, (height()/2)+100, -1.565);
    };

    /**
     * Creates the player's name who is on the top side of the game area
     */
    const top = () => {
        if (!players[Player.TOP]) {
            return;
        }
        showPlayer(players[Player.TOP].alias, Player.TOP, width()/2, 10);
    };

    scene.createPlayers = (tmp) => {
        if (tmp.length === 1) {
            players[Player.LEFT] = {alias: tmp[0].name};
        } else if (tmp.length === 2) {
            players[Player.LEFT] = {alias: tmp[0].name};
            players[Player.TOP] = {alias: tmp[1].name};
        } else if (tmp.length === 3) {
            players[Player.LEFT] = {alias: tmp[0].name};
            players[Player.TOP] = {alias: tmp[1].name};
            players[Player.RIGHT] = {alias: tmp[2].name};
        }
    };

    scene.showPlayers = () => {
        for (let i = this.scene.children.length-1; i>=0; i--) {
            const child = this.scene.children[i];
            if ( child.playerName ) {
                this.scene.removeChild(child);
            }
        }
        right();
        left();
        top();
    };

    scene.addPlayers = (player) => {
        if (Object.keys(players).length === 0) {
            players[Player.RIGHT] = {alias: player.name};
        } else if (Object.keys(players).length === 1) {
            players[Player.TOP] = {alias: player.name};
        } else if (Object.keys(players).length === 2) {
            players[Player.LEFT] = {alias: player.name};
        }
    };

    scene.setSeatNumber = (seatNo) => {
        this.seatNo = seatNo;
    };

    /**
     * Rests the list of domino
     */
    scene.resetDomino = () => {
        dominoToDrawFrom = [
            '0-0', '0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '2-2', '2-3', '2-4', '2-5', '2-6', '3-3', '3-4', '3-5', '3-6', '4-4', '4-5', '4-6', '5-5', '5-6', '6-6'
        ];
    };
    /**
     * Rests the board
     */
    scene.resetBoard = () => {
        for (let i = this.scene.children.length-1; i>=0; i--) {
            const child = this.scene.children[i];
            if (child.onBoard || child.playerName || child.mainPlayerName) {
                this.scene.removeChild(child);
            }
        }
    };

    /**
     * Draws a hand for a user.
     * @return {Array} The hand for the user.
     */
    const draw = () => {
        const hand = [];
        for (let i = 0; i < 7; i++) {
            const choice = Math.floor(Math.random() * dominoToDrawFrom.length);
            const domino = dominoToDrawFrom.splice(choice, 1)[0];
            hand.push(domino);
        }
        return hand;
    };

    /**
     * Shows the domino that is in a given user's hand.
     * @param {Array} hand - The domino in the user's hand.
     */
    const showDominos = (hand) => {
        let xStart = (width()/2)-((65*6)/2);
        const dominoSprites = [];
        hand.forEach((domino, index) => {
            const sprite = new PIXI.Sprite(dominoTextures[domino]);
            sprite.inHand = true;
            sprite.domino = domino;
            sprite.idx = index;
            sprite.height = 100;
            sprite.width = 60;
            sprite.position.x = xStart;
            sprite.position.y = height()-60;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.interactive = true;
            sprite
                .on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
                .on('mouseup', onDragEnd)
                .on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd)
                .on('touchendoutside', onDragEnd)
                .on('mousemove', onDragMove)
                .on('touchmove', onDragMove);
            dominoSprites.push(sprite);
            this.scene.addChild(sprite);
            xStart+=65;
        });
    };

    /**
     * Shows the back of a domino for the other players.
     * @param {Array} hand - The domino in the player's hand.
     * @param {Integer} hand - The starting x point to place the domino.
     * @param {Integer} hand - The starting y point to place the domino.
     * @param {Double} angle - The angle to place the domino.
     */
    const showDominowBack = (hand, x, y, angle) => {
        if (!x) {
            x = (width()/2)-((65*hand.length)/2);
        }
        if (!y) {
            y = (height()/2)-((65*hand.length)/2);
        }
        if (angle) {
            if (Math.abs(x-0) < Math.abs(x-width())) {
                x -= 80;
            } else {
                x += 80;
            }
        } else {
            y -= 80;
        }
        let xStart = x;
        let yStart = y;

        hand.forEach((domino) => {
            const sprite = new PIXI.Sprite(backTexture);
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
    /**
     * Shows the fornt face of the players domino.
     * @param {Array} hand - The domino in the player's hand.
     * @param {Integer} hand - The starting x point to place the domino.
     * @param {Integer} hand - The starting y point to place the domino.
     * @param {Double} angle - The angle to place the domino.
     */
    const showEnemyDominos = (hand, x, y, angle) => {
        if (!x) {
            x = (width()/2)-((65*hand.length)/2);
        }
        if (!y) {
            y = (height()/2)-((65*hand.length)/2);
        }
        if (angle) {
            if (Math.abs(x-0) < Math.abs(x-width())) {
                x -= 30;
            } else {
                x += 30;
            }
        } else {
            y -= 30;
        }
        let xStart = x;
        let yStart = y;

        hand.forEach((domino) => {
            const sprite = new PIXI.Sprite(dominoTextures[domino]);
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

    /**
     * Updates the hands of the users on the board.
     */
    const updateHands = () => {
        for (let i = this.scene.children.length-1; i>=0; i--) {
            const child = this.scene.children[i];
            if (child.inHand || child.playerName) {
                this.scene.removeChild(child);
            }
        }
        showDominos(this.scene.player.hand);
        showDominowBack(this.scene.topPlayer.hand, null, 80);
        showDominowBack(this.scene.leftPlayer.hand, 90, null, 1.565);
        showDominowBack(this.scene.rightPlayer.hand, width()-100, null, 1.565);

        left();
        right();
        top();
    };

    /**
     * Callback for when a domino is dragged.
     * @param {Object} event - The event provided.
     */
    function onDragStart (event) {
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

    /**
     * Callback for when a domino has stopped being dragged. It chceks the position on the board that it is closes to and checks if a match exists.
     */
    function onDragEnd () {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;

        //the euclidean distance to the left side of the board.
        var point0 = Math.sqrt( 
            (this.position.x-turnManager.endPoints[0].x)*(this.position.x-turnManager.endPoints[0].x) + 
            (this.position.y-turnManager.endPoints[0].y)*(this.position.y-turnManager.endPoints[0].y) 
        );
        //the euclidean distance to the right side of the board.
        var point1 = Math.sqrt( 
            (this.position.x-turnManager.endPoints[1].x)*(this.position.x-turnManager.endPoints[1].x) + 
            (this.position.y-turnManager.endPoints[1].y)*(this.position.y-turnManager.endPoints[1].y) 
        );
        //the euclidean distance to the players hand.
        var hand = Math.sqrt((this.position.y-(height()-60))*(this.position.y-(height()-60)));
        if (Math.abs(point0-point1) < 20) {
            toastr.error('You placed your domino too close to both endpoints, please ensure its close to where you want to put it.');
        } else {
            if (hand < point0 && hand < point1) {
                updateHands();
            } else {
                //checks if a match exists on the side and plays the domino else shows an error to the user.
                if (point0 < point1) {
                    const parts = this.domino.split('-');
                    if (parts[0] !== turnManager.options.choices[0] && parts[1] !== turnManager.options.choices[0]) {
                        toastr.error(`${this.domino} cannot be playd on ${turnManager.options.choices[0]}`);
                        updateHands();
                        return;
                    } else {
                        if (parts[0] === turnManager.options.choices[0]){
                            turnManager.userPlay({match: parts[0], domino: this.domino, idx: this.idx, side: BoardSides.LEFT, dominoSide: 0}, turnManager.options);
                        }
                        if (parts[1] === turnManager.options.choices[0]) {
                            turnManager.userPlay({match: parts[1], domino: this.domino, idx: this.idx, side: BoardSides.LEFT, dominoSide: 1}, turnManager.options);
                        }
                    }
                } else {
                    const parts = this.domino.split('-');
                    if (parts[0] !== turnManager.options.choices[1] && parts[1] !== turnManager.options.choices[1]) {
                        toastr.error(`${this.domino} cannot be playd on ${turnManager.options.choices[1]}`);
                        updateHands();
                        return;
                    } else {
                        if (parts[0] === turnManager.options.choices[1]){
                            turnManager.userPlay({match: parts[0], domino: this.domino, idx: this.idx, side: BoardSides.RIGHT, dominoSide: 0}, turnManager.options);
                        }
                        if (parts[1] === turnManager.options.choices[1]) {
                            turnManager.userPlay({match: parts[1], domino: this.domino, idx: this.idx, side: BoardSides.RIGHT, dominoSide: 1}, turnManager.options);
                        }
                    }
                }
            }
        }
    }

    /**
     * Callback for when a domino is being moved.
     */
    function onDragMove () {
        if (this.dragging)  {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;
        }
    }

    /**
     * Allows the screen to constantly animate.
     */
    function animate () {
        updateRender();
        requestAnimationFrame( animate );
    }
    //calls the animate method
    animate();

    /**
     * Renders the players and their hands.
     * @param {String} userAlias - The user's alias.
     */
    scene.renderPlayers = (userAlias) => {
        const aliasText = new PIXI.Text(`${userAlias} (${this.scene.scores[Player.BOTTOM]})`, { fontFamily: 'Snippet', fontSize: '25px', fill: 'white', align: 'left' });
        aliasText.position.x = width()-290;
        aliasText.position.y = height()-30;
        aliasText.mainPlayerName = true;
        this.scene.addChild(aliasText);
    };

    /**
     * Puts a domino on the board.
     * @param {String} domino - The domino to be played.
     * @param {Integer} x - The x axis to place the domino.
     * @param {Integer} y - The y axis to place the domino.
     * @param {Object} options - Other options passed to the function.
     */
    const putDominoOnBoard = (domino, x, y, angle, options) => {
        let dominoHeight = 65;
        let dominoWidth = 30;
        const texture = dominoTextures[domino];
        const sprite = new PIXI.Sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.height = dominoHeight;
        sprite.width = dominoWidth;
        sprite.onBoard = true;
        if (angle) {
           sprite.rotation += angle;
           const temp = dominoHeight;
           dominoHeight = dominoWidth;
           dominoWidth = temp;
        }
        this.scene.addChild(sprite);
        if (options.incrementY) {
            y += options.incrementY;
        }
        const obj = this.scene.endPoints || {};
        if (options.pose) {
            if (isDouble(domino)) {
                obj[0] = {x:x, y:y+dominoHeight/4};
                obj[1] = {x:x+dominoWidth, y:y+dominoHeight/4};
            } else {
                obj[0] = {x:x, y:y+dominoHeight/4};
                obj[1] = {x:x+dominoWidth, y:y+dominoHeight/4};
            }
        } else {
            if (options.side === BoardSides.LEFT) {
                obj[options.side] = {x:x-dominoWidth, y};
            } else if (options.side === BoardSides.RIGHT) {
                if (isDouble(domino)) {
                    obj[options.side] = {x:x+dominoWidth, y};
                } else {
                   obj[options.side] = {x:x, y}; 
                }
            }
        }
        this.scene.endPoints = obj;
    };

    /**
     * Show the hands of the players after a draw.
     */
    scene.showHands = () => {
        for (let i = this.scene.children.length-1; i>=0; i--) {
            const child = this.scene.children[i];
            if (child.inHand || child.playerName || child.mainPlayerName) {
                this.scene.removeChild(child);
            }
        }
        showDominos(this.scene.player.hand);
        showEnemyDominos(this.scene.topPlayer.hand, null, 80);
        showEnemyDominos(this.scene.leftPlayer.hand, 90, null, 1.565);
        showEnemyDominos(this.scene.rightPlayer.hand, width()-100, null, 1.565);
    };

    //adds the elements to the scene
    this.scene.addChild(title);
    this.scene.putDominoOnBoard = putDominoOnBoard;
    this.scene.updateHands = updateHands;
    
    return this.scene;
};