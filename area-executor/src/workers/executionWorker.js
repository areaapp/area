'use strict';

import { workerData, parentPort } from 'worker_threads';
import services from './services';


async function executeArea(area, ctx) {

    console.log('Area:', area);

    const action = services[area.serviceName][area.actionName];
    const actionResult = await action(area, ctx);

    // if (actionResult) {
    //     return services[area.serviceName][area.actionName]();
    // }
    return null;
}


(function executionWorker() {
    console.log('Thread spawned');
    const areas = workerData.areas;
    const ctx = workerData.ctx;

    return Promise.all(areas.map(async area => await executeArea(area, ctx)));
})()
    .then(() => parentPort.postMessage({ code: 0 }))
    .catch(() => parentPort.postMessage({ code: 84 }));
