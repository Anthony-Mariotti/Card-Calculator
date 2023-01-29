<script lang="ts">
    import { CardStore } from '$lib/stores/cards.store';
    import { CreditCard } from '$lib/types/CreditCard';
    import CardPreview from '$lib/components/CardPreview.svelte';
    import CardEditor from '$lib/components/CardEditor.svelte';

    let addingCard: boolean = false;
    let editingCard: boolean = false;

    let selectedCard: CreditCard = new CreditCard();

    let cardValues: CreditCard[];
    CardStore.subscribe((value) => (cardValues = value));

    $: totalBalance = cardValues
        .map((value) => value.balance)
        .reduce((prev, curr) => {
            return Number(prev) + Number(curr);
        }, 0);

    $: totalLimit = cardValues
        .map((value) => value.limit)
        .reduce((prev, curr) => {
            return Number(prev) + Number(curr);
        }, 0);

    $: weeklyPayment = cardValues.reduce((prev, curr) => {
        let calculated = Number(prev) + Number(curr.payment?.weeklyPayment);
        console.log('Weekly Payment:', calculated);
        return calculated;
    }, 0);

    $: possibleInterest = cardValues
        .map((value) => value.payment?.accruedInterest)
        .reduce((prev, curr) => {
            let calculated = Number(prev) + Number(curr);
            console.log('Possible Interest:', calculated);
            return calculated;
        }, 0);

    function startNewCard() {
        selectedCard = new CreditCard();
        addingCard = true;
    }

    function addCard(event: CustomEvent<CreditCard>) {
        CardStore.add(event.detail);
        editingCard = false;
        addingCard = false;
        selectedCard = new CreditCard();
    }

    function startEditCard(card: CreditCard) {
        selectedCard = card;
        editingCard = true;
    }

    function updateCard(event: CustomEvent<CreditCard>) {
        CardStore.edit(event.detail.id, event.detail);
        editingCard = false;
        addingCard = false;
        selectedCard = new CreditCard();
    }

    function cancelEdit() {
        addingCard = false;
        editingCard = false;
        selectedCard = new CreditCard();
    }
</script>

<div class="flex justify-between mb-4 bg-gray-100 items-center p-4 rounded-md">
    <div class="grid grid-rows-2 grid-cols-2 gap-x-2">
        <div class="font-bold">Total Balance:</div>
        <div>$ {totalBalance}</div>
        <div class="font-bold">Total Limit:</div>
        <div>$ {totalLimit}</div>
        <div class="font-bold">Weekly Payment:</div>
        <div>$ {weeklyPayment}</div>
        <div class="font-bold">Possible Interest:</div>
        <div>$ {possibleInterest}</div>
    </div>
    <div>
        <button
            on:click|preventDefault={startNewCard}
            type="submit"
            class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >New Card</button
        >
    </div>
</div>

{#await CardStore.init()}
    Loading...
{:then}
    {#if cardValues.length === 0 && editingCard !== true && addingCard !== true}
        <button
            on:click={startNewCard}
            type="button"
            class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <svg
                class="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
            </svg>
            <span class="mt-2 block text-sm font-medium text-gray-900">Add a new card</span>
        </button>
    {:else if cardValues.length > 0 && editingCard === false && addingCard === false}
        <div class="bg-gray-100 p-4 rounded-md">
            <div class="grid grid-flow-row auto-rows-max gap-y-2">
                {#each cardValues as currentCard}
                    <CardPreview
                        card={currentCard}
                        on:edit={() => startEditCard(currentCard)}
                        on:removed={() => CardStore.remove(currentCard.id)}
                    />
                {/each}
            </div>
        </div>
    {:else}
        <div class="bg-gray-100 p-4 rounded-md">
            <CardEditor
                card={selectedCard}
                editing={editingCard}
                adding={addingCard}
                on:add={addCard}
                on:cancel={cancelEdit}
                on:update={updateCard}
            />
        </div>
    {/if}
{/await}
