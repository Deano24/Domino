'use strict';

/**
 * Gets the screens height.
 * @return {Integer} The screens height.
 */
const height = () => {
    return  (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
};

/**
 * Gets the screens width.
 * @return {Integer} The screens width.
 */
const width = () => {
    return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
};

/**
 * Figures out if a domino is a double.
 * @return {Boolean} The result of the check.
 */
const isDouble = (domino) => {
    return domino === '0-0' || domino === '1-1' || domino === '2-2' || domino === '3-3' || domino === '4-4' || domino === '5-5' || domino === '6-6';
};