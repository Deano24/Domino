'use strict';

//sample play that you can use to simulate a game to find a bug in placement
const devPlay = [
    {match: "6", domino: "6-3", idx: "0"},
    {match: "3", domino: "3-0", idx: "0"},
    {match: "0", domino: "0-0", idx: "0"},
    {match: "0", domino: "0-1", idx: "0"},
    {match: "1", domino: "1-5", idx: "0"},
    {match: "5", domino: "5-6", idx: "0"},
    {match: "6", domino: "6-4", idx: "1"},
    {match: "4", domino: "4-2", idx: "0"},
    {match: "2", domino: "2-2", idx: "0"},
    {match: "2", domino: "2-3", idx: "0"},
    {match: "3", domino: "3-3", idx: "0"},
    {match: "3", domino: "4-3", idx: "1"},
    {match: "4", domino: "4-4", idx: "0"},
    {match: "4", domino: "4-0", idx: "0"},
    {match: "0", domino: "0-0", idx: "0"},
    {match: "0", domino: "0-5", idx: "0"},
    {match: "5", domino: "5-5", idx: "0"},
    {match: "5", domino: "5-4", idx: "0"},
    {match: "4", domino: "4-4", idx: "0"},
    {match: "4", domino: "4-3", idx: "0"},
    {match: -1, domino: null},
    {match: -1, domino: null},
    {match: -1, domino: null},
    {match: -1, domino: null}
];

const ai = {
    /**
     * Chooses the domino to play on the board.
     * @param {Array} hand - The list of dominoes the user currently holds in their hands.
     * @param {Array} ends - The playable ends currently on the domino board.
     * @return {Object} The play the ai should make. match - the matching dominoes, idx - the index of the domino, side: the side of the board to play on, dominoSide: the side of the matching domino.
     */
    playDomino (hand, ends) {
        //play doubles first.
        for(let i = 0; i < hand.length; i++) {
            if (hand[i] === '0-0' || hand[i] === '1-1' || hand[i] === '2-2' || hand[i] === '3-3' || hand[i] === '4-4' || hand[i] === '5-5' || hand[i] === '6-6' ) {
                const parts = hand[i].split('-');
                if (parts[0] === ends[0]) {
                    return {match: parts[0], domino: hand[i], idx: i, side: BoardSides.LEFT, dominoSide: 0};
                }
                if( parts[0] === ends[1]) {
                    return {match: parts[0], domino: hand[i], idx: i, side: BoardSides.RIGHT, dominoSide: 1};
                }
            }
        }
        //play next matching cards.
        for(let i = 0; i < hand.length; i++) {
            const parts = hand[i].split('-');
            if (parts[0] === ends[0]) {
                return {match: parts[0], domino: hand[i], idx: i, side: BoardSides.LEFT, dominoSide: 0};
            } 
            if (parts[0] === ends[1] ){
                return {match: parts[0], domino: hand[i], idx: i, side: BoardSides.RIGHT, dominoSide: 0};
            }
            if (parts[1] === ends[0] ) {
                return {match: parts[1], domino: hand[i], idx: i, side: BoardSides.LEFT, dominoSide: 1};
            }
            if( parts[1] === ends[1]) {
                return {match: parts[1], domino: hand[i], idx: i, side: BoardSides.RIGHT, dominoSide: 1};
            }
        }
        return {match: -1, domino: null};
    }
};