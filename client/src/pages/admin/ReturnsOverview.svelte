<script>
    import Refund from "../../components/Refund.svelte";
    import { onMount } from 'svelte';
    import SideNavigator from "./dashboard/SideNavigator.svelte";
    import {token} from "../../store.js";
    import {fetchData} from "../../lib/util.js";


    let isSidebarVisible = true;
    let contentMargin = '256px';

    $: {
        contentMargin = isSidebarVisible ? '256px' : '0px';
    }

    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
    }




    export let params;

    let refundPromise = fetchData(`http://localhost:3000/returns`, $token)


</script>


<SideNavigator {isSidebarVisible} {toggleSidebar} />
<section class="flex justify-center">
    <div class="w-5/12 mt-5">
        <div class="py-2 px-4 mb-3 bg-gray-100 rounded-2xl border-[1px] border-gray-200 text-center">
            <p>
                Review all the refunds you have made <br>
                Click on the item to see details <br>
                You can cancel a refund, if the package haven't arrived to our warehouse yet
            </p>
        </div>
        {#await refundPromise}
            Loading...
        {:then refundList}
            {#each refundList as refund}
                <Refund controllerId={refund.controllerId} collectorId={refund.collectorId} admin="true" on:refundCancelled={() => {
                    refundPromise = fetchData(`http://localhost:3000/users/${params.id}/returns`, $token)
                }} refund={refund}/>
            {/each}
        {/await}
    </div>
</section>
