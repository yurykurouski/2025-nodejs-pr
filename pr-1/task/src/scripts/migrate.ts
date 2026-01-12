import sequelize from '../config/database';
import '../models';

async function migrate() {
    try {
        console.log('Starting migration...');

        await sequelize.sync({ alter: true });
        console.log('Migration successful: Tables created or updated.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
