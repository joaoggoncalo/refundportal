<script>
    import { onMount } from 'svelte';
    import DataService from '../../../../DataService.js';

    let totalReturnItemsThisWeek = 0;
    let totalReturnItemsLastWeek = 0;
    let percentageChange = 0;
    const dataService = new DataService('http://localhost:3000');

    function isDateInWeekRange(date, weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return date >= weekStart && date <= weekEnd;
    }

    function getWeekStart(date) {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
        return new Date(weekStart.setHours(0, 0, 0, 0));
    }

    async function fetchTotalReturnItems() {
        try {
            const rmaData = await dataService.fetchRMATableData();
            const today = new Date();
            const thisWeekStart = getWeekStart(today);
            const lastWeekStart = getWeekStart(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));

            let returnItemsThisWeek = [];
            let returnItemsLastWeek = [];

            for (const rma of rmaData) {
                const returnItems = await dataService.fetchReturnItems(rma.rmaId);
                returnItems.forEach(item => {
                    const rmaDate = new Date(rma.createdDate);
                    if (isDateInWeekRange(rmaDate, thisWeekStart)) {
                        returnItemsThisWeek.push(item);
                    } else if (isDateInWeekRange(rmaDate, lastWeekStart)) {
                        returnItemsLastWeek.push(item);
                    }
                });
            }

            totalReturnItemsThisWeek = returnItemsThisWeek.length;
            totalReturnItemsLastWeek = returnItemsLastWeek.length;

            if (totalReturnItemsLastWeek > 0) {
                percentageChange = ((totalReturnItemsThisWeek - totalReturnItemsLastWeek) / totalReturnItemsLastWeek) * 100;
            } else if (totalReturnItemsThisWeek > 0) {
                percentageChange = 100;
            } else {
                percentageChange = 0;
            }

        } catch (error) {
            console.error('Error fetching total return items:', error);
        }
    }

    onMount(() => {
        fetchTotalReturnItems();
    });
</script>


<div class="order-count-container">
    <h2 class="text-xl font-semibold mb-2">Returned items this week</h2>
    <p class="text-3xl">{totalReturnItemsThisWeek}</p>
    <p class="text-sm text-gray-500">
        {percentageChange > 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`} Since last week
    </p>
</div>
