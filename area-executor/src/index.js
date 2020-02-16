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

    const areas = await db.getAreas();

    db.end();
    // try {
    //     await db.authenticate();
    // } catch (e) {
    //     console.error('Cannot connect to the specified database.');
    //     process.exit(1);
    // }

    // const ctx = new Context({ db, apiUrl: config.apiUrl });

    // console.log(ctx);
    // const threadsNb = process.env.threadsNb;

    // while (true) {
    //     await executor({ threadsNb });
    // }
})();
