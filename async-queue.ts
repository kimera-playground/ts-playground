export {}

interface Worker {
    Resolver: (_: any) => void,
    Task: <T>() => Promise<T>
}

class AsyncQueue{
    Pool: Array<Worker>
    MaxConcurrency: number
    Executing: number

    constructor(concurrency: number) {
        this.Executing = 0;
        this.MaxConcurrency = concurrency;
        this.Pool = new Array();
    }

    addTask(task: <T>() => Promise<T>) {
        return new Promise(resolve => {
            this.Pool.push({
                Task: task,
                Resolver: resolve
            })

            this.execute();
        })
    }

    private execute() {
        if (this.Pool.length === 0) return;
        if (this.Executing >= this.MaxConcurrency) return;

        const { Task, Resolver } = this.Pool.shift() as Worker;

        this.Executing++;
        Task().then(Resolver).finally(() => {
            this.Executing--;
            this.execute();
        });
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function main() {
    const tasks = new Array(100);
    const pool = new AsyncQueue(25);

    for (const _ of tasks) {
        pool.addTask(() => Process()).then(i =>   console.log("Processed Item " + i));
    }
}



function Process(): Promise<any> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getRandomInt(200));
        }, 1000);
    });
}

await main();
