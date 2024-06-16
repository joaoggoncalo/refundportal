<script>
    import { onMount } from 'svelte';
    import DataService from '../../../../DataService.js';

    let totalReturnItems = 0;
    const dataService = new DataService('http://localhost:3000');

    async function fetchTotalReturnItems() {
        try {
            const rmaData = await dataService.fetchRMATableData();

            const returnItemsCounts = await Promise.all(
                rmaData.map(rma =>
                    dataService.fetchReturnItems(rma.rmaId)
                        .then(returnItems => returnItems.length)
                )
            );

            totalReturnItems = returnItemsCounts.reduce((sum, count) => sum + count, 0);
        } catch (error) {
            console.error('Error fetching total return items:', error);
        }
    }

    onMount(() => {
        fetchTotalReturnItems();
    });
</script>


<div class="order-count-container">
    <h2 class="text-xl font-semibold mb-2">Total Returned Items</h2>
    <p class="text-3xl">{totalReturnItems}</p>
</div>
