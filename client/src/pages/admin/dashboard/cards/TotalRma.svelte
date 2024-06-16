<script>
    import {onMount, onDestroy} from 'svelte';
    import DataService from '../../../../DataService.js';
    import {settings} from "../SettingStore";

    let totalRmas = 0;
    let currentSetting = 'Monthly';
    export let setting = 'Monthly';
    const dataService = new DataService('http://localhost:3000');

    const unsubscribe = settings.subscribe(value => {
        if ((value.TotalRma === 'Monthly' || value.TotalRma === 'Yearly') && value.TotalRma !== currentSetting) {
            currentSetting = value.TotalRma;
            fetchRmas();
        }
    });


    async function fetchRmas() {
        try {
            const rmaData = await dataService.fetchRMATableData();

            switch (currentSetting) {
                case 'Monthly':
                    totalRmas = calculateMonthlyRmas(rmaData);
                    break;
                case 'Yearly':
                    totalRmas = calculateYearlyRmas(rmaData);
                    break;
            }
        } catch (error) {
            console.error('Error fetching RMAs:', error);
        }
    }

    $: title = getTitleBySetting(setting);


    function getTitleBySetting(setting) {
        switch (setting) {
            case 'Monthly':
                return 'Total Rma\'s (This Month)';
            case 'Yearly':
                return 'Total Rma\'s (This Year)';
            default:
                // Just in case, handle unexpected setting values
                console.warn(`Unexpected setting value: ${setting}`);
                return 'Total Rma\'s (This Month)';
        }
    }

    $: title = getTitleBySetting(setting);

    let title = getTitleBySetting(setting);



    function getWeekStart(date) {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
        return new Date(weekStart.setHours(0, 0, 0, 0));
    }


    function calculateMonthlyRmas(rmaData) {
        const now = new Date();
        return rmaData.filter(rma => {
            const rmaDate = new Date(rma.createdDate);
            return rmaDate.getMonth() === now.getMonth() && rmaDate.getFullYear() === now.getFullYear();
        }).length;
    }

    function calculateYearlyRmas(rmaData) {
        const currentYear = new Date().getFullYear();
        return rmaData.filter(rma => {
            const rmaDate = new Date(rma.createdDate);
            return rmaDate.getFullYear() === currentYear;
        }).length;
    }


    onMount(async () => {
        await fetchRmas();
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<h2 class="text-xl font-semibold mb-2">{title}</h2>
<p class="text-3xl">{totalRmas}</p>