<script>
    import Order from "../../components/Order.svelte";
    import {fetchData} from "../../lib/util.js";
    import {user, token} from "../../store.js";

    let ordersPromise = fetchData(`http://localhost:3000/users/${$user.id}/orders`, $token)

</script>

<section class="flex justify-center">
    <div class="w-5/12 mt-5">
        <div class="py-2 px-4 mb-3 bg-gray-100 rounded-2xl border-[1px] border-gray-200 text-center">
            <p>
                Review all the orders you have made <br>
                Click on the item to see details
            </p>
        </div>
        {#await ordersPromise}
            Loading...
        {:then ordersList}
            {#each ordersList as order}
                <Order orderId={order.orderId} date={order.orderDate} items={order.items}/>
            {/each}
        {/await}
    </div>
</section>