import { Worker as NodeWorker, isMainThread, parentPort, workerData } from 'worker_threads';
import { Dispatcher } from './Dispatcher';

export const NEW_TASK_MESSAGE = 'tasks_modify';

export class Worker {
    private worker: NodeWorker | null = null;

    /**
     * Starts the worker thread
     */
    start(): void {
        if (this.worker) {
            throw new Error('Worker is already running');
        }

        this.worker = new NodeWorker(__filename, {
            workerData: { type: 'dispatcher' }
        });

        this.worker.on('error', (error) => {
            console.error('Worker error:', error);
            this.stop();
        });

        this.worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
            this.worker = null;
        });
    }

    /**
     * Stops the worker thread
     */
    stop(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }

    /**
     * Checks if the worker is running
     */
    isRunning(): boolean {
        return this.worker !== null;
    }

    /**
     * Sends a message to the worker thread
     */
    sendMessage(message: { type: string }): void {
        if (!this.worker) {
            throw new Error('Worker is not running');
        }
        this.worker.postMessage(message);
    }
}

export const worker = new Worker();

// Worker thread code
if (!isMainThread && workerData?.type === 'dispatcher') {
    const dispatcher = new Dispatcher();

    // Handle messages from main thread
    parentPort?.on('message', (message) => {
        if (message.type === NEW_TASK_MESSAGE) {
            dispatcher.onNewTask();
        }
    });

    // Start the dispatcher
    dispatcher.start().catch((error) => {
        console.error('Dispatcher error:', error);
        process.exit(1);
    });
} 