import 'dotenv/config';

import { AppBootstrap } from './src/bootstrap/app-bootstrap';
import cluster from 'cluster';
import os from 'os';

export const startApp = () => {
    AppBootstrap.run();
};

export const startAppInClusterMode = () => {
    if (cluster.isPrimary) {
        const numOfCpus = os.cpus().length;

        console.log(`Primary process ${process.pid} is running`);

        // Fork workers
        for (let i = 0; i < numOfCpus; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker process ${worker.process.pid} exited`);
            cluster.fork();
        });
    } else {
        startApp();
    }
};

if (process.env.NODE_ENV === 'development') {
    startApp();
} else {
    startAppInClusterMode();
}
