import yargs from 'yargs';

export const config = yargs
  .env('SL')
  .usage('Usage: $0 [options]')
  .option('session-secret', {
    describe: 'Express session secret',
    default: 'thisIsSuperSecret',
    type: 'string',
  })
  .option('mock-mode', {
    describe: 'Use mock data',
    default: false,
    type: 'boolean',
  })
  .option('database-url', {
    describe: 'URL for to the database',
    default: 'mongodb://localhost/shoppinglist',
    type: 'string',
  })
  .group(['session-secret', 'mock-mode', 'database-url'], 'Config Options:')
  .wrap(Math.min(100, yargs.terminalWidth()))
  .alias('h', 'help')
  .alias('v', 'version').argv;
