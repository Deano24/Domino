'use strict';

const renderer = PIXI.autoDetectRenderer(width(), height(), {backgroundColor : 0x21751C});
document.body.appendChild(renderer.view);
renderer.backgroundColor = 0x21751C;
const stage = new PIXI.Container();

waitingDialog.show('Waiting for players to Join....');

/**
 * Sides of the board
 * @type {Enum}
 */
const BoardSides = {
    LEFT: 0,
    RIGHT: 1,
};

/**
 * Player positions on the board
 * @type {Enum}
 */
const Player = {
    BOTTOM: 0,
    RIGHT: 1,
    TOP: 2,
    LEFT: 3
};

let scenePlay;
let userAlias = localStorage.getItem('alias');
function getUrlParameter(sParam) {
    var val = '';
    var parts = document.location.search.split('=');
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] === '?'+sParam || parts[i] === '&'+sParam) {
            val = parts[i+1];
            break;
        }
    }
    return val;
}

const room = getUrlParameter('room');


/**
 * Re-renders the scene
 */
const updateRender = () =>{
    renderer.render(stage);
};

/**
 * Shhows a specific scene
 * @param {Integer} scene - The scene to show
 */
const showScene = () => {
    scenePlay.visible = false;
    scenePlay.renderPlayer(userAlias);
    scenePlay.visible = true;
    turnManager.playScene = scenePlay;
    renderer.render(stage);
};
let socket;
const socketSetup = () => {
    socket = io('http://localhost:8080');
    socket.on('connect', () => {
        socket.emit('playerInfo', {name: userAlias, room: room});
    });
    socket.on('setup', (data) => {
        scenePlay.setSeatNumber(data.seatNo);
        scenePlay.createPlayers(data.playerList);
        scenePlay.showPlayers();
    });
    socket.on('start', () => {
        waitingDialog.hide();
    });
    socket.on('playerJoined', (info) => {
        scenePlay.addPlayers({name: info.name, seatNo: info.seatNo});
        scenePlay.showPlayers();
    });
    socket.on('hand', (hand) => {
        scenePlay.showHand(hand.hand);
    });
    socket.on('updateEnemyHand', (hand) => {
        scenePlay.updateEnemyHand(hand.handCount, hand.seatNo);
    });
    socket.on('updateHand', (hand) => {
        scenePlay.updateHand(hand.hand);
    });
    socket.on('pose', () => {
        scenePlay.pose();
    });
    socket.on('play', () => {
        toastr.info('Your Play!');
        scenePlay.allowPlayUpdate(true);
    });
    socket.on('pass', () => {
        scenePlay.allowPlayUpdate(false);
        toastr.info('You Pass!'); 
    });
    socket.on('badPlay', (obj) => {
        toastr.error(obj.message);
    });
    socket.on('playerPassed', (obj) => {
        toastr.info(obj.message);
    });
    socket.on('choices', (obj) => {
        scenePlay.setChoices(obj.choices);
    });
    socket.on('gameOver', (obj) => {
        swal({
            title: obj.title,
            text: obj.message,
            html: true
        }, () => {
            window.location.href = 'http://localhost:9000/';
        });
    });
    socket.on('roundOver', (obj) => {
        swal({
            title: obj.title,
            text: obj.message,
            timer: 5000,
            showConfirmButton: false,
            html: true
        });
        setTimeout(() => {scenePlay.resetBoard();}, 2000);
    });
    socket.on('playerPlayed', (play) => {
        toastr.info(`${play.playerName} played ${play.play.domino}`);
        if (play.play.isPose) {
            scenePlay.putDominoOnBoard('6-6', width()/2,(height()/2 - 35), null, {pose: true});
        } else {
            turnManager.handlePlay(play.play);
        }
    });
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
};

const played = (play) => {
    scenePlay.allowPlayUpdate(false);
    socket.emit('played', {room: room, play: play});
};

const setup = () => {
    scenePlay = play(PIXI);
    stage.addChild(scenePlay);
    showScene();
    socketSetup();
};

/**
 * Restarts the game
 */
const restartGame = () => {
    scenePlay.resetDomino();
    scenePlay.resetBoard();
    showScene();
};

// Load them google fonts before starting...!
window.WebFontConfig = {
    google: {
        families: ['Snippet', 'Arvo:700italic', 'Podkova:700']
    },
    active: setup
};

// include the web-font loader script
/* jshint ignore:start */
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();
/* jshint ignore:end */
PIXI.DisplayObject.prototype.absolute = function(x,y){
    x = x || 0;
    y = y || 0;

    x+=this.x;
    y+=this.y;

    if (this.parent !== null) {
        return this.parent.absolute(x,y);
    } else {
        return {x:x,y:y};
    }
};