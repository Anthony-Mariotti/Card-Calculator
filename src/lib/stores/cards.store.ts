import { browser } from '$app/environment';
import type { CreditCard } from '$lib/types/CreditCard';

import { writable } from 'svelte/store';
import { validate } from 'uuid';
import { CreditCardStore } from './credit.store';

let db: CreditCardStore | undefined;

function createCardStore() {
    const { subscribe, set, update } = writable<Array<CreditCard>>([]);

    return {
        subscribe,
        init: async () => {
            if (browser) {
                db = await CreditCardStore.connect();
            }

            if (db !== undefined) {
                set(await db.getAll());
            }
        },
        add: (card: CreditCard) => {
            console.log('Adding card: ', card);
            update((n) => {
                return [...n, card];
            });
            db?.add(card);
        },
        remove: (id: string) => {
            console.log('Deleting card: %s', id);
            update((n) => {
                if (validate(id)) {
                    const index = n.findIndex((x) => x.id === id);
                    if (index > -1) {
                        n.splice(index, 1);
                    }
                }
                return n;
            });
            db?.delete(id);
        },
        edit: (id: string, card: CreditCard) => {
            console.log('Editing card: %s', id);
            update((n) => {
                if (validate(id)) {
                    const index = n.findIndex((x) => x.id === id);
                    if (index > -1) {
                        n[index] = card;
                    }
                }
                return n;
            });
            db?.update(id, card);
        },
        clear: () => {
            console.log('Clearing all cards');
            set([]);
        }
    };
}

export const CardStore = createCardStore();
