<script>
    import SideNavigator from "./SideNavigator.svelte";
    import Chart from "./Chart.svelte";
    import PieChart from "./PieChart.svelte";
    import List from "./List.svelte";
    import TotalReturnedItems from "./cards/TotalReturnedItems.svelte";
    import WeeklyReturnedItems from "./cards/WeeklyReturnedItems.svelte";
    import WeeklyRma from "./cards/WeeklyRma.svelte";
    import TotalRma from "./cards/TotalRma.svelte";
    import SettingsModal from "./SettingsModal.svelte";
    import {settings} from "./SettingStore";
    import {onDestroy} from "svelte";

    let isSidebarVisible = true;
    let isModalOpen = false;

    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
    }


    function toggleModal(){
        isModalOpen = !isModalOpen;
    }

    function handleUpdateSetting(event) {
        const { card, newSetting } = event.detail;
        settings.update(currentSettings => {
            return { ...currentSettings, [card]: newSetting };

        });

    }

    function handleUpdateChartType(newType) {
        settings.update(currentSettings => {
            return { ...currentSettings, ChartType: newType };
        });
    }



    $: marginLeft = isSidebarVisible ? '256px' : '20px'; // Adjust '20px' as needed

    let currentSettings;
    const unsubscribe = settings.subscribe(value => {
        currentSettings = value;
    });

    $: chartType = currentSettings.ChartType;


    onDestroy(() => {
        unsubscribe(); // Clean up the subscription
    });


</script>



<SideNavigator {isSidebarVisible} {toggleSidebar} />

<div class="dashboard-container" style="margin-left: {marginLeft}; transition: margin-left 0.3s ease;">
    <button on:click={toggleModal} class="settings-button">
        <i class="fas fa-cog"></i>
    </button>

    {#if isModalOpen}
        <SettingsModal
                on:updateSetting={handleUpdateSetting}
                on:updateChartType={handleUpdateChartType}
                on:closeModal={toggleModal}
                totalRmaSetting={currentSettings.TotalRma}
                chartType={currentSettings.ChartType}
        />
    {/if}
    <div class="grid grid-cols-2 lg:grid-cols-12 gap-6">
        <!-- Left Column: Key Metrics -->
        <div class="lg:col-span-3 space-y-6">
            <div class="grid grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow p-4 aspect-square">
                    <WeeklyRma setting={currentSettings.WeeklyRma} />
                </div>
                <div class="bg-white rounded-lg shadow p-4 aspect-square">
                    <TotalRma setting={currentSettings.TotalRma} />
                </div>
                <div class="bg-white rounded-lg shadow p-4 aspect-square">
                    <WeeklyReturnedItems/>
                </div>
                <div class="bg-white rounded-lg shadow p-4 aspect-square">
                    <TotalReturnedItems/>
                </div>
            </div>
        </div>

        <!-- Right Column: Charts and Lists -->
        <div class="lg:col-span-9 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <Chart {chartType} />
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <PieChart/>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <List/>
            </div>
        </div>
    </div>
</div>

<style>
    .settings-button {
        background: none;
        border: none;
        cursor: pointer;
    }

    .settings-button i {
        color: #555555;
        font-size: 24px;
    }
</style>


