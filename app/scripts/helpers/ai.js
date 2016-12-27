'use strict';

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