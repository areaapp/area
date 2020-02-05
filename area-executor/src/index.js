'use strict';

import executor from './executor.js';


(async function main() {
    const threadsNb = process.env.threadsNb;

    while (true) {
        await executor({ threadsNb });
    }
})();
