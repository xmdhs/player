export default class waitgroup {
    constructor() {}

    private i: number = 0;

    public add(delta: number): void {
        this.i += delta;
        this.do();
    }

    public done(): void {
        this.i--;
        this.do();
    }

    private do() {
        if (this.i === 0) {
            this.resolveList.forEach(resolve => resolve());
        }
        if (this.i < 0) {
            throw new Error("waitgroup: negative count");
        }
    }

    private resolveList = [] as (() => void)[];

    public wait(): Promise<void> {
        if (this.i === 0) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            this.resolveList.push(resolve);
        });
    }
}