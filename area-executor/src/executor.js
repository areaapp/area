import { Worker } from 'worker_threads';

import services from './services';


/**
 * @function executor
 * Split areas in `threadNb` chunks and run those areas in multiple threads
 *
 * @param {Object} opts - Executor options
 * @return {Promise}
 */
export default function executor({ threadsNb }) {
    const areas = []; // get areas form db
    const areasChunks = makeChunks(areas, threadsNb);

    return Promise.all(areasChunks.map(runWorker));
};


/**
 * @function runWorker
 * Execute areas in another thread
 *
 * @param {Array} areas - A group of areas to execute
 * @return {Promise}
 */
function runWorker(areas) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./executionWorker.js', { areas });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', reject);
    });
}


/**
 * @function makeChunks
 * Split an array in chunks
 *
 * @param {Array} arr
 * @param {Number} size
 * @return {Array} - A 2d array
 */
function makeChunks(arr, size) {
    const result = [];

    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
