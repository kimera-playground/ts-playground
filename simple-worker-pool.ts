export {}

type Result = [number, any]

const taskQueue: Array<Promise<Result>> = [...new Array(25)].map((_, i) => Promise.resolve([i, null]));

async function main() {
    const tasks = new Array(100);

    for (const task of tasks) {
        const [workerIndex, _] = await Promise.race(taskQueue);
        taskQueue[workerIndex] = Process(workerIndex).then(result => [ workerIndex, result ]);
    }
}

async function Process(workerID: Number) {
    return new Promise(r => setTimeout(() => {
        console.log(`Processsing item ${workerID}`);
        r(true);
    }, 1000));
}

await main();
