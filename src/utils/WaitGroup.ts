export default class waitgroup {
    constructor() {

    }

    private i: number = 0;

    public add(delta: number): void {
        this.i += delta;
    }

    public done(): void {
        this.i--;
        if (this.i === 0) {
            this.resolveList.forEach(resolve => resolve());
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