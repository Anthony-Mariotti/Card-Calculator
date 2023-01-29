<script lang="ts">
    import type { CardBrand } from '$lib/types/CardBrand';
    import type { CreditCard } from '$lib/types/CreditCard';
    import { DateTime } from 'luxon';
    import { createEventDispatcher } from 'svelte';
    import CardBrandPreview from './CardBrandPreview.svelte';
    import CardSelector from './CardSelector.svelte';

    export let adding: boolean = false;
    export let editing: boolean = false;
    export let card: CreditCard;

    let dispatch = createEventDispatcher();
    let cardSelectVisible: boolean = false;
    let dueDate: string = card.dueDate.toISODate();

    function brandSelected(event: CustomEvent<CardBrand>) {
        card.brand = event.detail;
        cardSelectVisible = false;
    }

    function update() {
        card.dueDate = DateTime.fromISO(dueDate);
        dispatch('update', card);
    }

    function add() {
        card.dueDate = DateTime.fromISO(dueDate);
        dispatch('add', card);
    }
</script>

<form class="space-y-4">
    <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">
            {#if adding}
                Add a card
            {:else if editing}
                Editing card
            {:else}
                Viewing card
            {/if}
        </h3>
        <p class="mt-1 max-w-3xl text sm text-gray-500">
            This information is will only be stored on your device and does not reach out to any
            server to be stored.
        </p>
    </div>
    <div class="flex justify-between items-center bg-gray-200 p-4 rounded-md">
        <div class="flex">
            <div class="relative inline-block">
                <button
                    on:click={() => (cardSelectVisible = !cardSelectVisible)}
                    type="button"
                    class="mr-4 h-full flex-shrink-0 duration-100 hover:scale-110 flex items-center justify-center"
                    class:scale-110={cardSelectVisible === true}
                >
                    <CardBrandPreview brand={card.brand} />
                </button>
                {#if cardSelectVisible}
                    <div
                        class="absolute z-10 mt-2 p-4 w-max rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                        <CardSelector on:selected={brandSelected} />
                    </div>
                {/if}
            </div>
            <div class="grid grid-flow-col auto-cols-auto gap-x-8">
                <div>
                    <div class="truncate text-sm font-medium text-gray-500">Balance</div>
                    <div class="text-3xl font-semibold tracking-tight text-gray-900">
                        <div class="relative w-44 mt-1 rounded-md shadow-sm">
                            <div
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                                <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                bind:value={card.balance}
                                type="number"
                                name="balance"
                                id="balance"
                                class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                aria-describedby="balance-currency"
                            />
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <span class="text-gray-500 sm:text-sm" id="balance-currency"
                                    >USD</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="truncate text-sm font-medium text-gray-500">Limit</div>
                    <div class="text-3xl font-semibold tracking-tight text-gray-900">
                        <div class="relative w-44 mt-1 rounded-md shadow-sm">
                            <div
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                                <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                bind:value={card.limit}
                                type="number"
                                name="limit"
                                id="limit"
                                class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                aria-describedby="limit-currency"
                            />
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <span class="text-gray-500 sm:text-sm" id="limit-currency">USD</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="truncate text-sm font-medium text-gray-500">Rate</div>
                    <div class="text-3xl font-semibold tracking-tight text-gray-900">
                        <div class="relative w-44 mt-1 rounded-md shadow-sm">
                            <div
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            />
                            <input
                                bind:value={card.rate}
                                type="number"
                                name="limit"
                                id="limit"
                                class="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                aria-describedby="limit-currency"
                            />
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <span class="text-gray-500 sm:text-sm" id="limit-currency">%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="truncate text-sm font-medium text-gray-500">Due Date</div>
                    <div class="text-3xl font-semibold tracking-tight text-gray-900">
                        <div class="relative w-44 mt-1 rounded-md shadow-sm">
                            <div
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            />
                            <input
                                bind:value={dueDate}
                                type="date"
                                name="due"
                                id="due"
                                class="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                aria-describedby="due-date"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <button
                on:click|preventDefault={() => dispatch('cancel')}
                type="button"
                class="inline-flex items-center rounded-md border border-transparent bg-gray-600 p-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {#if editing}
                <button
                    on:click|preventDefault={update}
                    type="submit"
                    class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </button>
            {:else if adding}
                <button
                    on:click|preventDefault={add}
                    type="submit"
                    class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </button>
            {/if}
        </div>
    </div>
</form>
