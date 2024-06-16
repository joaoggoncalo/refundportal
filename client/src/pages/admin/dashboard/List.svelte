<script>
    import { onMount } from 'svelte';
    import DataService from '../../../DataService.js';

    const dataService = new DataService('http://localhost:3000');

    let items = [];

    onMount(async () => {
        try {
            let rmaData = await dataService.fetchRMATableData();
            rmaData = rmaData.map(rma => ({ ...rma, returnItems: [], isDetailsVisible: false }));

            let approvedRmaData = rmaData;

            let allReturnItems = [];
            for (const rma of approvedRmaData) {
                const returnItems = await dataService.fetchReturnItems(rma.rmaId);
                allReturnItems.push(...returnItems);
            }

            let productCounts = allReturnItems.reduce((counts, item) => {
                counts[item.productId] = (counts[item.productId] || 0) + 1;
                return counts;
            }, {});

            let productPromises = Object.entries(productCounts).map(async ([productId, count]) => {
                const productData = await getItemName(productId);
                return { name: productData.name, amount: count };
            });

            let products = await Promise.all(productPromises);
            products.sort((a, b) => b.amount - a.amount); // Sort by amount, descending

            // Pick top 5 products and assign colors
            const colors = [
                '#db5f57',
                '#b9db57',
                '#57db94',
                '#5784db',
                '#c957db'
            ];
             items = products.slice(0, 5).map((product, index) => ({
                ...product,
                 color: colors[index % colors.length]
            }));

        } catch (error) {
            console.error('Error populating items list:', error);
        }
    });

    async function getItemName(productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (response.ok){
                const data = await response.json();
                return data;
            }
        } catch (e) {
            console.log(e);
        }
    }
</script>

<div class="p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Top 5 Most Returned Products</h2>
    <ul>
        {#each items as item, index (item.name)}
            <li class="mb-4 last:mb-0">
                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-700">{item.name}</div>
                    <div class="text-sm font-medium text-gray-700">{item.amount}</div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div class="h-2.5 rounded-full" style="background-color: {item.color}; width: {item.amount / items[0].amount * 100}%"></div>
                </div>
            </li>
        {/each}
    </ul>
</div>

<style>
    /* Custom styles */
    .last\:mb-0:last-child {
        margin-bottom: 0;
    }
</style>
