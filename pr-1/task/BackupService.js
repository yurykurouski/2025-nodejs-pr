const fs = require('fs');
const path = require('path');

class BackupService {
    constructor(studentManager, logger, backupInterval = 5000) {
        this.studentManager = studentManager;
        this.logger = logger;
        this.backupInterval = backupInterval;
        this.intervalId = null;
        this.backupDir = path.join(__dirname, 'backups');
    }

    start() {
        if (this.intervalId) {
            this.logger.log('Backup service is already running.');
            return;
        }

        this.logger.log(`Starting backup service (Interval: ${this.backupInterval}ms)...`);
        this.intervalId = setInterval(() => this.backupData(), this.backupInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.logger.log('Backup service stopped.');
        }
    }

    async backupData() {
        try {
            // Ensure backup directory exists
            await fs.promises.mkdir(this.backupDir, { recursive: true });

            const students = this.studentManager.getAllStudents();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `students_${timestamp}.backup.json`;
            const filePath = path.join(this.backupDir, filename);

            const data = JSON.stringify(students, null, 2);
            await fs.promises.writeFile(filePath, data, 'utf8');

            this.logger.log(`Backup created successfully: ${filename}`);
        } catch (error) {
            this.logger.log('Backup failed:', error.message);
        }
    }
}

module.exports = BackupService;
