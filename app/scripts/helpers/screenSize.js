'use strict';

const height = () => {
    return  (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 20;
};

const width = () => {
    return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 20;
};