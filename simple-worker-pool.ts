export {}

type Result<T> = [number, T?]

class WorkerPool<T> {
    Pool: Array<Promise<Result<T>>>

    constructor(size: number) {
        this.Pool = [...new Array(size)].map((_, i) => Promise.resolve([i]));
    }

    async runTask(task: (Id: number) => Promise<T>) {
        const [workerIndex, _] = await Promise.race(this.Pool);
        this.Pool[workerIndex] = task(workerIndex).then(result => [workerIndex, result]);
    }
}

async function main() {
    const tasks = new Array(100);
    const pool = new WorkerPool<unknown>(25);

    for (const _ of tasks) {
        await pool.runTask(index => Process(index));
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}  

function Process(workerID: Number) {
    return new Promise(r => setTimeout(() => {
        console.log(`Processsing item ${workerID}`);
        r(true);
    }, getRandomInt(1000)));
}

await main();
