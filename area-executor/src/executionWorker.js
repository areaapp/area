import services from './services';

import { workerData, parentPort } from 'worker_threads';

async function executeArea(area) {
    const actionResult = await services[area.serviceName][area.actionName]();

    if (actionResult) {
        return services[area.serviceName][area.actionName]();
    }
    return null;
}


(function executionWorker() {
    const areas = workerData.areas;

    return Promise.all(areas.map(executeArea));
})()
    .then(() => parentPort.postMessage({ code: 0 }))
    .catch(() => parentPort.postMessage({ code: 84 }));
