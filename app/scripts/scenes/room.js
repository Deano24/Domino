'use strict';

/**
 * The room screen for the application.
 * @param {Object} PIXI - PIXIJS framework
 * @return {Object} The scene to be displayed.
 */
const rooms = (PIXI) => {
    const scene = new PIXI.Container();

    //text showing the user's alias.
    const aliasText = new PIXI.Text('User: ', { fontFamily: 'Snippet', fontSize: '25px', fill: 'white', align: 'left' });

    aliasText.position.x = 20;
    aliasText.position.y = 40;

    /**
     * Adds the user's name to the alias text.
     * @param {String} name - The user's alias.
     */
    scene.updateName = (name) => {
        aliasText.text = `User: ${name}`;
    };

    //The title text
    var title = new PIXI.Text('Domino Central', { fontFamily: 'Snippet', fontSize: '35px', fill: 'white', align: 'left' });
    title.position.x = (width()/2)-(title.width/2);
    title.position.y = 40;

    //default rooms available
    const rooms = [
        { title: 'Awesome room 101', players: 2, id:1 },
        { title: 'Awesome room 102', players: 3, id:2 },
        { title: 'Awesome room 103', players: 1, id:3 },
        { title: 'Awesome room 104', players: 4, id:4 },
        { title: 'Awesome room 105', players: 0, id:5 },
    ];

    //height tracker that is used to keep track of the height.
    let heightTracking = title.height+title.position.y+30;

    /**
     * Click handler for rooms, allows navigating to selected room.
     * @param {Integer} is - The id of the room.
     */
    const goToRoom = (id) => {
        this.id = id;
        showScene(Scenes.PLAY);
    };
    //iterates over each room creates the text and places them on the screen.
    rooms.forEach((room) => {
        let roomName = new PIXI.Text(room.title, { fontFamily: 'Arvo', fontSize: '30px', fontStyle: 'bold italic', fill: '#3e1707', align: 'center', stroke: '#a4410e', strokeThickness: 7, textDecoration: 'line-through' });
        if (room.players === 4) {
            roomName = new PIXI.Text(room.title, { fontFamily: 'Arvo', fontSize: '30px', fontStyle: 'bold italic', fill: '#808080', align: 'center', stroke: 'black', strokeThickness: 7, textDecoration: 'line-through' });
        } else {
            roomName.interactive = true;
            roomName.on('mousedown', () => { goToRoom(room.id); });
            roomName.on('touchstart', () => { goToRoom(room.id); });
        }
        roomName.position.x = (width()/2)-(roomName.width/2);
        roomName.position.y = heightTracking;
        const roomPlayers = new PIXI.Text(`Players: ${room.players}`, { fontFamily: 'Snippet', fontSize: '15px', fill: 'white', align: 'center' });
        roomPlayers.position.x = roomName.position.x+roomName.width+20;
        roomPlayers.position.y = heightTracking+15;
        heightTracking += roomName.height;
        scene.addChild(roomName);
        scene.addChild(roomPlayers);
    });

    //adds elements to the scne.
    scene.addChild(title);
    scene.addChild(aliasText);

    return scene;
};