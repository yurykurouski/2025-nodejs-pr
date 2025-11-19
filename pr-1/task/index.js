const path = require('path');
const Logger = require('./Logger');
const StudentManager = require('./StudentManager');

const { parseArgs } = require('./utils');
const { demo } = require('./demo')

const DATA_FILE = path.join(__dirname, 'students.json');

const BackupService = require('./BackupService');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function main() {
  const { verbose, quiet } = parseArgs();

  const logger = new Logger(verbose, quiet);
  const manager = new StudentManager(logger);
  const backupService = new BackupService(manager, logger);

  logger.log('Loading student data...');
  await manager.loadJSON(DATA_FILE);

  backupService.start();

  demo(manager, logger);

  // Keep process alive to demonstrate backup (e.g., 6 seconds for a 5s interval)
  logger.log('Waiting for backup service...');
  await delay(6000);

  // Stop backup service
  backupService.stop();

  logger.log('Saving data...');
  await manager.saveToJSON(DATA_FILE);
  logger.log('Done.');
})()
