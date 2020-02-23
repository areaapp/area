'use strict';

/**
* @function sleep
* Sleep the execution thread for a duration
*
* @param {Number} time - Duration of sleep (in ms)
* @return {Promise}
*/
export async function sleep (time) {
    return await new Promise(res => setTimeout(res, time));
};


/**
* @function unique
* Make array elements unique
*
* @param {Array} arr
* @return {Array}
*/
export function unique(arr) {
    return [...new Set(arr)];
}
