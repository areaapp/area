'use strict';

import yargs from 'yargs';

/**
* @function parseArgs
* Parse arguments or take env by default
*
* @return {Object} config
*/
export function parseArgs() {
    const argv = yargs
          .option('db_host', {
              alias: 'H',
              type: 'string',
              description: 'Area database address',
              demandOption: !process.env['AREADB_HOST'],
              default: process.env['AREADB_HOST']
          })
          .option('db_port', {
              alias: 'P',
              type: 'number',
              description: 'Area database port',
              demandOption: !process.env['AREADB_PORT'],
              default: Number(process.env['AREADB_PORT'])
          })
          .option('db_name', {
              alias: 'N',
              type: 'string',
              description: 'Area database name',
              demandOption: !process.env['AREADB_NAME'],
              default: process.env['AREADB_NAME']
          })
          .option('db_user', {
              alias: 'U',
              type: 'string',
              description: 'Area database user',
              demandOption: !process.env['AREADB_USER'],
              default: process.env['AREADB_USER']
          })
          .option('db_pass', {
              alias: 'p',
              type: 'string',
              demandOption: !process.env['AREADB_PASS'],
              default: process.env['AREADB_PASS']
          })
          .option('api_url', {
              alias: 'a',
              type: 'string',
              description: 'Area API url',
              demandOption: !process.env['AREA_APIURL'],
              default: process.env['AREA_APIURL']
          })
          .option('clock', {
              alias: 'c',
              type: 'number',
              description: 'Executor clock in seconds',
              demandOption: !process.env['AREA_APIURL'],
              default: process.env['EXECUTOR_CLOCK'] || 300
          })
          .option('min_areas', {
              alias: 'm',
              type: 'number',
              description: 'Minimum number of areas per worker',
              demandOption: !process.env['EXECUTOR_MIN_AREAS'],
              default: Number(process.env['EXECUTOR_MIN_AREAS']) || 10
          })
          .option('workers', {
              alias: 'w',
              type: 'number',
              description: 'Number of workers used by the executor',
              demandOption: !process.env['EXECUTOR_WORKERS'],
              default: Number(process.env['EXECUTOR_WORKERS']) || 4
          })
          .help()
          .argv;

    if (argv.db_port < 0 ||
        argv.db_port > 65535 ||
        !Number.isInteger(argv.db_port)) {
        throw new Error('Database port should be an integer between 0 and 65535.');
    }

    if (argv.workers < 1 || !Number.isInteger(argv.workers)) {
        throw new Error('Workers number should be an integer greater than 0.');
    }

    if (argv.min_areas < 1 || !Number.isInteger(argv.min_areas)) {
        throw new Error('The minimum number of areas per worker should be an integer greater than 0');
    }


    return {
        db: {
            host: argv.db_host,
            name: argv.db_name,
            port: argv.db_port,
            user: argv.db_user,
            pass: argv.db_pass
        },
        apiUrl: argv.api_url,
        minAreas: argv.min_areas,
        workers: argv.workers,
        clock: argv.clock
    };
}
