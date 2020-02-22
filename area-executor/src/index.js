'use strict';

require('dotenv').config();

import axios from 'axios';
import consola from 'consola';

import { parseArgs } from './cli.js';
import { sleep } from './utils.js';
import Context from './context.js';
import Database from './database.js';
import executor from './executor.js';

// import executor from './executor.js';


(async function main() {
    let config = null;
    try {
        config = parseArgs();
    } catch (e) {
        consola.error(`Invalid parameters. ${e.message}`);
        process.exit(1);
    }

    const db = new Database(config.db);

    try {
        await db.tryConnection();
    } catch (e) {
        consola.error(e.message);
        process.exit(1);
    }

    const ctx = new Context({
        db,
        axios: axios.create({
            baseURL: config.apiUrl
        }),
        workers: config.workers,
        minAreas: config.minAreas
    });

    try {
        await ctx.init();
    } catch (e) {
        consola.error(e.message);
        process.exit(1);
    }

    const msClock = config.clock * 1000;

    while (true) {
        await sleep(msClock);
        await executor(ctx);
    }

    ctx.db.end();
})();
