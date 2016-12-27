'use strict';

toastr.options.timeOut = 1000;
toastr.options.onclick = function(event) { 
    if (event.currentTarget.innerText.includes('. Click here to play again.')) {
        restartGame();
    }
};
const renderer = PIXI.autoDetectRenderer(width(), height(), {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);
const stage = new PIXI.Container();

/**
 * different scenes that can be shown
 * @type {Enum}
 */
const Scenes = {
    LANDING: 0, 
    ROOM: 1, 
    PLAY: 2,
};

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

let sceneLanding, sceneRoom, scenePlay;
let userAlias;

/**
 * Loads all the scenes to be used later.
 */
const loadScenes = () => {
    sceneLanding = landing(PIXI);
    sceneRoom = rooms(PIXI);
    scenePlay = play(PIXI);
    stage.addChild(sceneLanding);
    stage.addChild(sceneRoom);
    stage.addChild(scenePlay);
    showScene(Scenes.LANDING);
};

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
const showScene = (scene) => {
    sceneLanding.visible = false;
    sceneRoom.visible = false;
    scenePlay.visible = false;
    switch(scene) {
        case Scenes.LANDING:
            sceneLanding.visible = true;
            break;
        case Scenes.ROOM:
            sceneRoom.updateName(userAlias);
            sceneRoom.visible = true;
            break;
        case Scenes.PLAY:
            scenePlay.renderPlayers(userAlias);
            scenePlay.renderPassText();
            scenePlay.visible = true;
            turnManager.playScene = scenePlay;
            turnManager.updateRender = updateRender;
            turnManager.start();
            break;
    }
    renderer.render(stage);
};

/**
 * Restarts the game
 */
const restartGame = () => {
    scenePlay.resetDomino();
    scenePlay.resetBoard();
    showScene(Scenes.PLAY);
};

// Load them google fonts before starting...!
window.WebFontConfig = {
    google: {
        families: ['Snippet', 'Arvo:700italic', 'Podkova:700']
    },
    active: loadScenes,
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