export class ThreadManager {
    private sleepTimeout: NodeJS.Timeout | null = null;
    private isSleeping: boolean = false;

    /**
     * Puts the thread to sleep for a specified duration
     * @param durationMs Duration in milliseconds
     * @returns Promise that resolves when the sleep duration is over
     */
    async sleep(durationMs: number): Promise<void> {
        if (this.isSleeping) {
            throw new Error('Thread is already sleeping');
        }

        this.isSleeping = true;

        return new Promise((resolve) => {
            this.sleepTimeout = setTimeout(() => {
                this.isSleeping = false;
                this.sleepTimeout = null;
                resolve();
            }, durationMs);
        });
    }

    /**
     * Wakes up the thread if it's sleeping
     */
    wake(): void {
        if (this.sleepTimeout) {
            clearTimeout(this.sleepTimeout);
            this.sleepTimeout = null;
            this.isSleeping = false;
        }
    }

    /**
     * Checks if the thread is currently sleeping
     */
    isThreadSleeping(): boolean {
        return this.isSleeping;
    }
} 