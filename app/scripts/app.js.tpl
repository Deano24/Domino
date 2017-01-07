'use strict';

toastr.options.timeOut = 1000;

const renderer = PIXI.autoDetectRenderer(width(), height(), {backgroundColor : 0x21751C});
document.body.appendChild(renderer.view);
renderer.backgroundColor = 0x21751C;
const stage = new PIXI.Container();

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
    console.log(parts);
    console.log(parts);
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] === '?'+sParam || parts[i] === '&'+sParam) {
            val = parts[i+1];
            break;
        }
    }
    console.log(val);
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
    scenePlay.renderPlayers(userAlias);
    scenePlay.visible = true;
    turnManager.playScene = scenePlay;
    turnManager.updateRender = updateRender;
    renderer.render(stage);
};
const socketSetup = () => {
    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
        socket.emit('playerInfo', {name: userAlias, room: room});
    });
    socket.on('setup', (data) => {
        scenePlay.setSeatNumber(data.seatNo);
        scenePlay.createPlayers(data.playerList);
        scenePlay.showPlayers();
    });
    socket.on('start', () => {
        console.log('start');
        //setup();
    });
    socket.on('playerJoined', (info) => {
        scenePlay.addPlayers({name: info.name, seat: info.seatNo});
        scenePlay.showPlayers();
    });
    socket.on('hand', (obj) => {
        console.log('hand');
        console.log(obj);
    });
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
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

/**
 * Handles the ending of the game
 * @param  {Array} standings - Array of objects containing the standings
 */
const handleGameOver = (standings) => {
    standings.sort(function(a, b){return b.score-a.score;});
    let losers = '<ul>';
    for (let i = 1; i < 4; i++) {
        if (standings[i].score === 0) {
            losers += `<li>${standings[i].info.name}</li>`;
        }
    }
    losers += '</ul>';
    let message = `The winner with a score of ${standings[0].score} is <b>${standings[0].info.name}</b>. And the following were put to shame: `;
    if (standings[0].score > 0 && standings[1].score > 0 && standings[2].score > 0&& standings[3].score > 0){
       message = 'The game has ended in a draw :('; 
    }
    swal({
        title: 'Game Over',
        text: message,
        html: true
    }, function () {
        window.location.href = 'http://localhost:9000/';
    });
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