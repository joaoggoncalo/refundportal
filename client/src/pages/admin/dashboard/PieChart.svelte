<script>
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
    import DataService from '../../../DataService.js';

    let chart = null;
    let chartElement;
    const dataService = new DataService('http://localhost:3000');
    let data = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#db5f57', '#b9db57', '#57db94', '#5784db', '#c957db'],
        }]
    };

    async function fetchPieChartData() {
        try {
            let rmaData = await dataService.fetchRMATableData();

            let allReturnItems = [];
            for (const rma of rmaData) {
                const returnItems = await dataService.fetchReturnItems(rma.rmaId);
                allReturnItems.push(...returnItems);
            }

            let statusCounts = allReturnItems.reduce((counts, item) => {
                if (item.productStatus !== null) {
                    counts[item.productStatus] = (counts[item.productStatus] || 0) + 1;
                }
                return counts;
            }, {});

            let statuses = Object.entries(statusCounts)
                .map(([productStatus, count]) => ({ productStatus, count }))
                .sort((a, b) => b.count - a.count) // Sort by count, descending
                .slice(0, 5);
            data.labels = statuses.map(s => s.productStatus);
            data.datasets[0].data = statuses.map(s => s.count);
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    }



    onMount(async () => {
        await fetchPieChartData();
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 60,
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };
        chart = new Chart(chartElement, config);
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });
</script>

<h2 class="text-xl font-semibold text-gray-800 mb-6">Top Product status</h2>
<div class="pie-chart-container">
    <canvas bind:this={chartElement}></canvas>
</div>

<div class="legend">
    {#each data.labels as label, i}
        <div class="legend-item">
            <span class="dot" style="background-color: {data.datasets[0].backgroundColor[i]}"></span>
            <span class="label">{label} ({(data.datasets[0].data[i] / data.datasets[0].data.reduce((a, b) => a + b) * 100).toFixed(0)}%)</span>
        </div>
    {/each}
</div>

<style>
    .pie-chart-container {
        position: relative;
        width: 100%;
        height: 300px;
    }

    .center-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    .amount {
        display: block;
        font-size: 2rem;
        font-weight: bold;
    }

    .label {
        display: block;
        font-size: 1rem;
    }

    .legend {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-top: 1rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .dot {
        height: 15px;
        width: 15px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
    }

    .label {
        margin-right: 4px;
        font-size: 14px;
    }

    .value {
        font-weight: bold;
        font-size: 14px;
    }

</style>