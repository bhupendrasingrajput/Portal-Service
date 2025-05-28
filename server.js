import './utils/loadVariables.js';
import cluster from 'cluster';
import os from 'os';

import config from './config/index.js';
import { connectToDatabase } from './config/database.js';
import startApp from './app.js';

const numCPUs = config.environment === 'development' ? 2 : os.cpus().length;
const PORT = config.port;

if (cluster.isPrimary) {
    console.log(`🧠 Primary process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.error(`💥 Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    (async () => {
        try {
            await connectToDatabase();
            const app = await startApp();

            app.listen(PORT, () => {
                console.log(`🚀 Worker processs ${process.pid} running on port ${PORT}`);
            });
        } catch (err) {
            console.error('❌ Portal service startup failed:', err);
            process.exit(1);
        }
    })();
}
