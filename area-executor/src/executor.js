'use strict';

import path from 'path';
import { Worker } from 'worker_threads';


/**
 * @function executor
 * Split areas in `threadNb` chunks and run those areas in multiple threads
 *
 * @param {Object} opts - Executor options
 * @return {Promise}
 */
export default async function executor(ctx) {
    const areas = await ctx.db.getAreas();
    const areasChunks = distributeAreas(areas, ctx.workers, ctx.minAreas);

    return Promise.all(areasChunks.map(async chunk => runWorker(chunk, ctx)));
};


/**
 * @function runWorker
 * Execute areas in another thread
 *
 * @param {Array} areas - A group of areas to execute
 * @return {Promise}
 */
function runWorker(areas, ctx) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.resolve(__dirname, 'workers/executionWorker.js'),
            {
                workerData: {
                    areas,
                    ctx
                }
            }
        );

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', reject);
    });
}


/**
 * @function distributeAreas
 * Make distribution of areas on multiple workers
 *
 * @param {Array} areas - All areas
 * @param {Number} workers - Number of workers
 * @param {Number} minAreas - Minimum number of areas per worker
 * @return {Array} An array of areas to dispatch in workers
 */
function distributeAreas(areas, workers, minAreas) {
    const minWorkers = Math.floor(areas.length / minAreas);

    if (minWorkers >= workers) {
        return makeChunks(areas, workers);
    }

    return makeChunks(areas, minWorkers);
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
    const len = arr.length;
    const result = [];
    let minChunkSize = Math.ceil(len / size);

    for (let index = 0; index < len; index += minChunkSize) {
        result.push(arr.slice(index, index + minChunkSize));
    }

    return result;
}
