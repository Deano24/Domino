'use strict';

const landing = (PIXI) => {

    const scene = new PIXI.Container();

    var title = new PIXI.Text('Let us play some DOMINOES!', { fontFamily: 'Snippet', fontSize: '35px', fill: 'white', align: 'left' });
    title.position.x = (width()/2)-(title.width/2);
    title.position.y = 40;

    var playText = new PIXI.Text('PLAY  ', { fontFamily: 'Arvo', fontSize: '60px', fontStyle: 'bold italic', fill: '#3e1707', align: 'center', stroke: '#a4410e', strokeThickness: 7 });
    playText.position.x = (width()/2);
    playText.position.y = (height()/2)-playText.height;
    playText.anchor.x = 0.5;
    playText.interactive = true;

    var aliasText = new PIXI.Text('Who are you?', { fontFamily: 'Snippet', fontSize: '35px', fill: 'white', align: 'left' });
    aliasText.position.x = (width()/2)-(playText.width/2)-230;
    aliasText.position.y = playText.position.y-62;

    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.width = '200px';
    input.style.height = '30px';
    input.style.top = playText.position.y-50;
    input.style.left = (width()/2)-(playText.width/2);
    document.body.appendChild(input);

    const onPlayClicked = () => {
        if (input.value && input.value !== '') {
            userAlias = input.value;
            document.body.removeChild(input);
            showScene(Scenes.ROOM);
        } else {
            alert('Alias is needed');
        }
    };

    playText.on('mousedown', onPlayClicked);
    playText.on('touchstart', onPlayClicked);

    scene.addChild(title);
    scene.addChild(aliasText);
    scene.addChild(playText);
    return scene;
};