<script>
    import { onMount } from 'svelte';
    import DataService from '../../../../DataService.js';

    let totalRmas = 0;
    let percentageChange = 0;

    const dataService = new DataService('http://localhost:3000');

    function getWeekStart(date) {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1)); // Adjust when day is Sunday
        return new Date(weekStart.setHours(0, 0, 0, 0));
    }

    function isDateInWeekRange(date, weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return date >= weekStart && date <= weekEnd;
    }

    async function fetchRmas() {
        try {
            const rmaData = await dataService.fetchRMATableData();

            const today = new Date();
            const thisWeekStart = getWeekStart(today);
            const lastWeekStart = getWeekStart(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));

            let thisWeekCount = 0, lastWeekCount = 0;
            rmaData.forEach(rma => {
                const rmaDate = new Date(rma.createdDate);
                if (isNaN(rmaDate.getTime())) {
                    console.error('Invalid date format:', rma.createdDate);
                    return;
                }

                if (isDateInWeekRange(rmaDate, thisWeekStart)) {
                    if (rmaDate <= today) {
                        thisWeekCount++;
                    }
                    totalRmas++;
                } else if (isDateInWeekRange(rmaDate, lastWeekStart)) {
                    lastWeekCount++;
                }

            });

            if (lastWeekCount > 0) {
                percentageChange = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
            } else if (thisWeekCount > 0) {
                percentageChange = 100;
            } else {
                percentageChange = 0;
            }


        } catch (error) {
            console.error('Error fetching RMAs:', error);
        }
    }

    onMount(() => {
        fetchRmas();
    });
</script>

<h2 class="text-xl font-semibold mb-2">This week Rma's</h2>
<p class="text-3xl">{totalRmas}</p>
<p class="text-sm text-gray-500">
    {percentageChange > 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`} Since last week
</p>
