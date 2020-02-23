'use strict';

import { workerData, parentPort } from 'worker_threads';

import services from '../services';
import consola from 'consola';

async function executeArea(area, ctx) {
    const action = services[area.serviceName][area.action.name];
    const reaction = services[area.serviceName][area.reaction.name];

    try {
        await action(area, reaction, ctx);
    } catch (e) {
        consola.error(e.message);
    }
    // if (actionResult) {
    //     return services[area.serviceName][area.actionName]();
    // }
}


(function executionWorker() {
    console.log('Thread spawned');
    const areas = workerData.areas;
    const ctx = workerData.ctx;

    return Promise.all(areas.map(async area => await executeArea(area, ctx)));
})()
    .then(() => parentPort.postMessage({ code: 0 }))
    .catch(() => parentPort.postMessage({ code: 84 }));
