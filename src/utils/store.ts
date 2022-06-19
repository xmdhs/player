interface store<T> {
    set(key: string, value: T): Promise<void>;
    get(key: string): Promise<T>;
}

export class LocalStore<T> implements store<T> {
    async set(key: string, value: T): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async get(key: string): Promise<T> {
        let s = localStorage.getItem(key);
        if (s) {
            return JSON.parse(s);
        }
        throw new Error("not found");
    }
}

export class RemoteStore<T> implements store<T> {
    private api: () => string;

    constructor(api: () => string) {
        this.api = api;
    }

    async set(key: string, value: T): Promise<void> {
        await fetch(this.api() + "store/" + key, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
        })
    }

    async get(key: string): Promise<T> {
        let s = await fetch(this.api() + "store/" + key);
        if (s.status == 200) {
            return await s.json();
        }
        if (s.status == 404) {
            new Error("not found")
        }
        throw new Error(await s.text());
    }
}