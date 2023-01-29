import { CreditCard, type ICreditCard } from '$lib/types/CreditCard';
import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';
import { browser } from '$app/environment';
import type { CardBrand } from '$lib/types/CardBrand';

interface CreditCardDB extends DBSchema {
    cards: {
        value: {
            id: string;
            limit: number;
            balance: number;
            rate: number;
            brand: CardBrand;
            dueDate: string;
        };
        key: string;
        indexes: {};
    };
}

export class CreditCardStore {
    private _connection: IDBPDatabase<CreditCardDB> | undefined;

    public connected: boolean = false;

    private constructor(connection?: IDBPDatabase<CreditCardDB>) {
        if (browser) {
            if (connection !== undefined) {
                this._connection = connection;
                this.connected = true;
                return;
            }
        }

        this._connection = undefined;
        this.connected = false;
    }

    public static async connect(): Promise<CreditCardStore> {
        return new CreditCardStore(await this.createConnection());
    }

    private async connect(): Promise<void> {
        if (browser) {
            this._connection = await CreditCardStore.createConnection();
            this.connected = true;
        }
    }

    public static create(): CreditCardStore {
        return new CreditCardStore();
    }

    public async get(id: string): Promise<CreditCard | undefined> {
        if (!this.connected) {
            await this.connect();
        }
        var result = await this._connection?.get('cards', id);
        if (result === undefined) {
            return undefined;
        }

        return CreditCard.fromDB(
            result.id,
            result.limit,
            result.balance,
            result.rate,
            result.brand,
            result.dueDate
        );
    }

    public async getAll(): Promise<CreditCard[]> {
        if (!this.connected) {
            await this.connect();
        }

        var all = await this._connection?.getAll('cards');

        if (all === undefined) {
            return [];
        }

        return all.map((val) =>
            CreditCard.fromDB(val.id, val.limit, val.balance, val.rate, val.brand, val.dueDate)
        );
    }

    public async add(card: CreditCard): Promise<boolean> {
        if (!this.connected) {
            await this.connect();
        }
        var key = await this._connection?.add('cards', {
            id: card.id,
            limit: card.limit,
            balance: card.balance,
            rate: card.rate,
            brand: card.brand,
            dueDate: card.dueDate.toISO()
        });
        if (!this.isNullOrEmpty(key)) {
            return true;
        }
        return false;
    }

    public async update(id: string, card: CreditCard): Promise<boolean> {
        if (!this.connected) {
            await this.connect();
        }
        var key = await this._connection?.put('cards', {
            id: card.id,
            limit: card.limit,
            balance: card.balance,
            rate: card.rate,
            brand: card.brand,
            dueDate: card.dueDate.toISO()
        });
        if (!this.isNullOrEmpty(key)) {
            return true;
        }
        return false;
    }

    public async delete(id: string): Promise<boolean> {
        if (!this.connected) {
            await this.connect();
        }
        try {
            await this._connection?.delete('cards', id);
            return true;
        } catch {
            return false;
        }
    }

    private static async createConnection(): Promise<IDBPDatabase<CreditCardDB>> {
        return await openDB<CreditCardDB>('ccc', 1, {
            upgrade(database, oldVersion, newVersion, transaction, event) {
                var cardStore = database.createObjectStore('cards', {
                    keyPath: 'id'
                });
            }
        });
    }

    private isNullOrEmpty(value: string | undefined | null): boolean {
        if (value === undefined || value === null || value === '') {
            return true;
        }
        return false;
    }
}
