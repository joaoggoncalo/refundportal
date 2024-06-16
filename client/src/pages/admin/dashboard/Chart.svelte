<script>
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
    import DataService from "../../../DataService";

    export let chartType;
    let chart = null;
    let chartElement;
    const dataService = new DataService('http://localhost:3000');
    let allRmaData = [];
    let currentYearFilter = 'All';
    let availableYears = [];

    function groupByMonth(rmaData) {
        const monthCounts = new Map();

        for (const rma of rmaData) {
            const month = new Date(rma.createdDate).getMonth();
            monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
        }

        return Array.from({ length: 12 }, (_, i) => monthCounts.get(i) || 0);
    }

    function isActiveYear(year) {
        return currentYearFilter === year.toString();
    }

    async function fetchAndRenderChart() {
        try {
            // Debug: Log the current year filter
            console.log("Current Year Filter:", currentYearFilter);

            const filteredData = currentYearFilter === 'All'
                ? allRmaData
                : allRmaData.filter(rma => {
                    // Ensure comparison between similar types (both strings)
                    const rmaYear = new Date(rma.createdDate).getFullYear().toString();
                    // Debug: Log the RMA year
                    console.log("RMA Year:", rmaYear);
                    return rmaYear === currentYearFilter;
                });

            // Debug: Log the number of filtered RMAs
            console.log("Filtered RMAs Count:", filteredData.length);

            const monthlyData = groupByMonth(filteredData);


            if (chart) {
                chart.destroy();
            }

            chart = new Chart(chartElement, {
                type: chartType,
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [{
                        label: `RMA Data (${currentYearFilter})`,
                        data: monthlyData,
                        fill: false,
                        fillColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    maintainAspectRatio: false
                }
            });
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }

    $: chartType, fetchAndRenderChart();


    onMount(async () => {
        allRmaData = await dataService.fetchRMATableData();

        // Debug: Log the initial RMA data load
        console.log("Initial RMA Data:", allRmaData);

        const yearsSet = new Set();
        allRmaData.forEach(rma => {
            const year = new Date(rma.createdDate).getFullYear();
            yearsSet.add(year);
        });
        availableYears = Array.from(yearsSet);
        fetchAndRenderChart();
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });

    function setYearFilter(year) {
        currentYearFilter = year;
        fetchAndRenderChart();
    }
</script>

<div class="relative h-64">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Number of RMA's per month</h2>
    <canvas bind:this={chartElement}></canvas>
    <div class="button-group">
        {#each Array.from(availableYears) as year}
            <button
                    class="year-button {isActiveYear(year) ? 'active' : ''}"
                    on:click={() => setYearFilter(year.toString())}>
                {year}
            </button>
        {/each}
        <button
                class="year-button {isActiveYear('All') ? 'active' : ''}"
                on:click={() => setYearFilter('All')}>
            Overall
        </button>
    </div>
</div>

<style>


    .button-group {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .year-button {
        background-color: #5784db; /* Primary button color */
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 15px;
        margin: 0 5px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
    }


    .year-button:hover {
        background-color: #db5f57; /* Hover effect color */
        transform: scale(1.05);
    }

    .year-button:active {
        transform: scale(0.95);
    }
</style>
