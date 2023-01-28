import type { CreditCard } from '$lib/types/CreditCard';

import { writable } from 'svelte/store';
import { validate } from 'uuid';

function createCardStore() {
    const { subscribe, set, update } = writable<Array<CreditCard>>([]);

    return {
        subscribe,
        add: (card: CreditCard) =>
            update((n) => {
                console.log('Adding card: ', card);
                return [...n, card];
            }),
        remove: (id: string) =>
            update((n) => {
                console.log('Deleting card: %s', id);
                if (validate(id)) {
                    const index = n.findIndex((x) => x.id === id);
                    if (index > -1) {
                        n.splice(index, 1);
                    }
                }
                return n;
            }),
        edit: (id: string, card: CreditCard) =>
            update((n) => {
                console.log('Editing card: %s', id);
                if (validate(id)) {
                    const index = n.findIndex((x) => x.id === id);
                    if (index > -1) {
                        n[index] = card;
                    }
                }
                return n;
            }),
        clear: () => {
            console.log('Clearing all cards');
            set([]);
        }
    };
}

export const CardStore = createCardStore();
