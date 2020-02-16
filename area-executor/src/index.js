'use strict';

require('dotenv').config();
import { parseArgs } from './cli.js';

// import executor from './executor.js';


(async function main() {
    let config = null;
    try {
        config = parseArgs();
    } catch (e) {
        console.error(`Invalid parameters. ${e.message}`);
        process.exit(1);
    }

    console.log(config);

    // const threadsNb = process.env.threadsNb;

    // while (true) {
    //     await executor({ threadsNb });
    // }
})();
