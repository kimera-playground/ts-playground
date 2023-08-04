export {}

class Semaphore {
    private max: number = 0;
    private locks: CallableFunction[] = []

    constructor(limit: number){
        this.max = limit;
    }
    
    async acquire() { 
        if (this.max > 0) {
            this.max--;
            return Promise.resolve();
        }
        return new Promise(resolve => {
            this.locks.push(resolve);
        })
    }

    async release() {
        const next = this.locks.shift();
        next?.();
    }
}

async function Process(workerID: string) {
    return new Promise(r => setTimeout(() => {
        console.log(`Processsing item ${workerID}`);
        r(true);
    }, 1000));
}

async function mainS() {
    const tasks = [...new Array(10)];
    const semaphore = new Semaphore(2);

    await Promise.all(tasks.map(async (_, i) => {
        await semaphore.acquire();
        return Process(i.toString()).finally(() => {
            semaphore.release();
        });
    }))
}

await mainS();