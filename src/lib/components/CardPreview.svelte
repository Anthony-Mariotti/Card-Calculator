<script lang="ts">
    import type { CreditCard } from '$lib/types/CreditCard';
    import { DateTime } from 'luxon';
    import { createEventDispatcher } from 'svelte';
    import CardBrandPreview from './CardBrandPreview.svelte';

    export let card: CreditCard;

    const dispatch = createEventDispatcher();

    function editCard() {
        dispatch('edit', card);
    }

    function removeCard() {
        dispatch('removed', card.id);
    }

    function GetDaysLeft(): string {
        const raw = card.dueDate.diffNow('days').days;
        const days = Math.floor(raw);

        if (days === 1) {
            return `${days} day`;
        }

        if (days > 1) {
            return `${days} days`;
        }

        return 'Today';
    }
</script>

<div class="flex justify-between items-center bg-gray-200 p-4 rounded-md">
    <div class="flex items-center">
        <div class="mr-4 flex-shrink-0">
            <CardBrandPreview brand={card.brand} />
        </div>
        <div class="grid grid-flow-col auto-cols-auto gap-x-8">
            <div>
                <div class="truncate text-sm font-medium text-gray-500">Balance</div>
                <div class="text-3xl font-semibold tracking-tight text-gray-900">
                    ${card.balance}
                </div>
            </div>
            <div>
                <div class="truncate text-sm font-medium text-gray-500">Limit</div>
                <div class="text-3xl font-semibold tracking-tight text-gray-900">
                    ${card.limit}
                </div>
            </div>
            <div>
                <div class="truncate text-sm font-medium text-gray-500">Rate</div>
                <div class="text-3xl font-semibold tracking-tight text-gray-900">
                    {card.rate}%
                </div>
            </div>
            <div>
                <div class="truncate text-sm font-medium text-gray-500">Due Date</div>
                <div class="text-3xl font-semibold tracking-tight text-gray-900">
                    {card.dueDate.toFormat('LL/dd/yyyy')}
                </div>
            </div>
            <div>
                <div class="truncate text-sm font-medium text-gray-500">Due</div>
                <div class="text-3xl font-semibold tracking-tight text-gray-900">
                    {#if card.payment?.weeksUntilDue !== undefined && card.payment?.weeksUntilDue > 1}
                        {card.payment?.weeksUntilDue} weeks
                    {:else if card.payment?.weeksUntilDue === 0 && card.payment.pastDue}
                        Past Due
                    {:else if card.payment?.weeksUntilDue === 0 && !card.payment.pastDue}
                        {GetDaysLeft()}
                    {:else}
                        {card.payment?.weeksUntilDue} week
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
        <button
            on:click={editCard}
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
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
            </svg>
        </button>
        <button
            on:click={removeCard}
            type="button"
            class="inline-flex items-center rounded-md border border-transparent bg-red-600 p-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
            </svg>
        </button>
    </div>
</div>