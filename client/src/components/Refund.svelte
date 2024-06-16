<script>
    import router from "page";
    import {token, user} from "../store.js";
    import {deleteData, fetchData} from "../lib/util.js";
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    let isExpanded = false;
    export let collectorId, controllerId, admin;
    export let refund;
    const toggleExpand = () => {
        isExpanded = !isExpanded;
    }

    let totalPrice = refund.items.reduce((sum, item) => sum + item.price, 0);
    const itemsPromise = fetchData(`http://localhost:3000/returns/${refund.rmaId}/return-items`, $token)

    function refundDetails(orderId) {
        router(`/admin/returns/${orderId}`);
    }

    const cancelRma = async (e) => {
        e.target.disabled = true;
        await deleteData(`http://localhost:3000/returns/${refund.rmaId}`, $token);
        dispatch('refundCancelled', refund.id);
    }

</script>

<div class="border p-4 mb-4 cursor-pointer" on:click={toggleExpand}
     role="button" tabindex="0" on:keydown={toggleExpand}>

    <div class="flex justify-between items-center">
        <div>
            <p class="text-lg font-bold">Refund {refund.rmaId}</p>
            <p class="text-sm">{refund.createdDate}</p>
        </div>
        <div>
            <span class="py-2 px-4 mr-2 font-bold text-xs rounded-2xl"
                  class:bg-teal-400={refund.status === 'in transit'}
                  class:bg-yellow-300={refund.status === 'received'}
                  class:bg-green-300={refund.status === 'processed'}>
                {refund.status.toUpperCase()}
            </span>
            <button>
                <span class={isExpanded ? 'icon-expanded' : 'icon-collapsed'}></span>
            </button>
        </div>
    </div>

    {#if isExpanded}
        <div class="mt-4">
            {#await itemsPromise}
                Loading...
            {:then items}
                {#each items as item}
                    <div class="flex justify-between">
                        <div class="mb-2">
                            <span class="mr-1.5">{item.name}</span>
                            <span>{item.price}€</span>
                        </div>
                        <div>
                            {#if item.processStatus !== null}
                            <span class="py-1 px-2 mr-2 rounded-2xl font-light text-xs"
                                  class:bg-green-400={item.processStatus.toLowerCase() === 'approved'}
                                  class:bg-red-400={item.processStatus.toLowerCase() === 'declined'}>
                                {item.processStatus.toUpperCase()}
                            </span>
                            {:else}
                            <span class="py-1 px-2 mr-2 rounded-2xl font-light text-xs bg-teal-400">
                                PENDING
                            </span>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/await}

            {#if collectorId != null}
                <div class="flex justify-between font-bold">
                    <span>Collected by: </span>
                    <span>{collectorId}</span>
                </div>
            {/if}

            {#if controllerId != null}
                <div class="flex justify-between font-bold">
                    <span>Controlled by: </span>
                    <span>{controllerId}</span>
                </div>
            {/if}

            <div class="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>{totalPrice}€</span>
            </div>

            {#if admin === "true"}
                <button on:click={() => refundDetails(refund.rmaId)} type="button"
                        class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Refund details
                </button>
            {/if}

            {#if refund.status === "in transit" && $user.role === 2}
                <button class="bg-red-800 text-white w-full p-2 text-center"
                        on:click={e => cancelRma(e)}>
                    Cancel
                </button>
            {/if}
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
