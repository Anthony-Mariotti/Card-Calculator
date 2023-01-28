<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { CardBrand } from '$lib/types/CardBrand';
    import CardBrandPreview from './CardBrandPreview.svelte';

    const dispatch = createEventDispatcher();

    function selected(brand: CardBrand): void {
        console.log('CardSelector::Selected:', brand);
        dispatch('selected', brand);
    }
</script>

<div class="grid grid-cols-3 gap-4" role="none">
    <button
        on:click={() => selected(CardBrand.Visa)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.Visa} />
    </button>
    <button
        on:click={() => selected(CardBrand.MasterCard)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.MasterCard} />
    </button>
    <button
        on:click={() => selected(CardBrand.Amex)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.Amex} />
    </button>
    <button
        on:click={() => selected(CardBrand.Discover)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.Discover} />
    </button>
    <button
        on:click={() => selected(CardBrand.AppleCard)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.AppleCard} />
    </button>
    <button
        on:click={() => selected(CardBrand.Chase)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.Chase} />
    </button>
    <button
        on:click={() => selected(CardBrand.CapitalOne)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.CapitalOne} />
    </button>
    <button
        on:click={() => selected(CardBrand.JBC)}
        type="button"
        class="duration-100 hover:scale-110"
    >
        <CardBrandPreview brand={CardBrand.JBC} />
    </button>
</div>
