'use strict';

require('dotenv').config();

import axios from 'axios';

import { parseArgs } from './cli.js';
import Context from './context.js';
import Database from './database.js';

// import executor from './executor.js';


(async function main() {
    let config = null;
    try {
        config = parseArgs();
    } catch (e) {
        console.error(`Invalid parameters. ${e.message}`);
        process.exit(1);
    }

    const db = new Database(config.db);

    try {
        await db.tryConnection();
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }

    const _axios = axios.create({
        baseURL: config.apiUrl
    });

    const ctx = new Context({
        db,
        axios: _axios,
        workers: config.workers,
        minAreas: config.minAreas
    });

    await ctx.init();

    console.log(ctx);
    // const threadsNb = process.env.threadsNb;

    // while (true) {
    //     await executor({ threadsNb });
    // }

    ctx.db.end();
})();
