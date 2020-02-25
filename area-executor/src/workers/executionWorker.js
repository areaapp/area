'use strict';

import { workerData, parentPort } from 'worker_threads';
import consola from 'consola';
import axios from 'axios';

import Context from '../context.js';
import services from '../services';
import Database from '../database.js';


async function executeArea(area, ctx) {
    const action = services[area.action.service_name].default.actions.default[area.action.name];
    const reaction = services[area.reaction.service_name].default.reactions.default[area.reaction.name];

    try {
        await action(area, reaction, ctx);
    } catch (e) {
        ctx.notifier.notifie(area.user.id, `${area.name} execution failure`);
        consola.error(e.message);
    }
}


(async function executionWorker() {
    const areas = workerData.areas;
    const services = workerData.services;
    const dbConfig = workerData.dbConfig;
    const _axios = axios.create({});
    const db = new Database(dbConfig);
    const ctx = new Context({
        axios: _axios,
        services,
        dbConfig,
        db
    });

    await Promise.all(areas.map(async area => (
        await executeArea(area, ctx)
    )));

    ctx.db.end();
})()
    .then(() => parentPort.postMessage({ code: 0 }))
    .catch(() => parentPort.postMessage({ code: 84 }));
