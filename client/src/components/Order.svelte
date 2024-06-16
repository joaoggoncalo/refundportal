<script>
    import page from "page"
    import {user} from "../store.js"

    let isExpanded = false;
    export let orderId, date, items;

    const toggleExpand = () => {
        isExpanded = !isExpanded;
    }

    const moveToCreateRMAPage = (event) => {
        event.stopPropagation();
        page.redirect(`/customer/${$user.id}/orders/${orderId}`)
    }

</script>

<div class="border p-4 mb-4 cursor-pointer" on:click={toggleExpand}
     role="button" tabindex="0" on:keydown={toggleExpand}>
    <div class="flex justify-between items-center">
        <div>
            <p class="text-lg font-bold">Order {orderId}</p>
            <p class="text-sm">{date}</p>
        </div>
        <button>
            <span class={isExpanded ? 'icon-expanded' : 'icon-collapsed'}></span>
        </button>
    </div>

    {#if isExpanded}
        <div class="mt-4">
            {#each items as item}
                <div class="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                </div>
            {/each}
            <div class="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>{
                    Math.floor(items.reduce((total, item) => total + parseFloat(item.price), 0) * 10) / 10
                }€</span>
            </div>
            <button class="bg-slate-700 text-white w-full p-2 text-center"
                    on:click={e => moveToCreateRMAPage(e)}>
                Refund
            </button>
        </div>
    {/if}
</div>

<style>
    .icon-collapsed::after {
        content: 'v';
    }

    .icon-expanded::after {
        content: '^';
    }
</style>
