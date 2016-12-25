'use strict';

const ai = {
    playDomino (hand, ends) {
        for(let i = 0; i < hand.length; i++) {
            const parts = hand[i].split('-');
            if (parts[0] === ends[0]) {
                return {match: parts[0], domino: hand[i], idx: i, side: 0, dominoSide: 0};
            } 
            if (parts[0] === ends[1] ){
                return {match: parts[0], domino: hand[i], idx: i, side: 1, dominoSide: 0};
            }
            if (parts[1] === ends[0] ) {
                return {match: parts[1], domino: hand[i], idx: i, side: 0, dominoSide: 1};
            }
            if( parts[1] === ends[1]) {
                return {match: parts[1], domino: hand[i], idx: i, side: 1, dominoSide: 1};
            }
        }
        return {match: -1, domino: null};
    }
};