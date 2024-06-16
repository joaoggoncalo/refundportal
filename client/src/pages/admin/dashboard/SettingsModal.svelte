<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let totalRmaSetting = 'Weekly';
    export let chartType = 'bar';

    function updateSetting(card, newSetting) {
        dispatch('updateSetting', { card, newSetting });
    }

    function getButtonLabel(setting) {
        return setting === 'Yearly' ? 'Switch to Monthly View' : 'Switch to Yearly View';
    }

    function toggleChartType() {
        const newType = chartType === 'bar' ? 'line' : 'bar';
        dispatch('updateChartType', newType);
    }

    $: buttonLabel = getButtonLabel(totalRmaSetting);
    $: chartButtonLabel = chartType === 'bar' ? 'Switch to Line Chart' : 'Switch to Bar Chart';

</script>

<div class="modal-backdrop">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Dashboard Settings</h2>
            <button class="modal-close" on:click={() => dispatch('closeModal')}>×</button>
        </div>

        <div class="settings-section">
            <h3 class="settings-title">Total RMA Settings</h3>
            <p class="current-setting">Current View: {totalRmaSetting === 'Yearly' ? 'Yearly' : 'Monthly'}</p>
            <button class="settings-button" on:click={() => updateSetting("TotalRma",totalRmaSetting === 'Yearly' ? 'Monthly' : 'Yearly')}>
                {getButtonLabel(totalRmaSetting)}
            </button>
        </div>

    </div>
</div>

<style>
    .settings-section {
        text-align: center;
        padding: 10px 0;
    }

    .current-setting {
        margin: 10px 0;
        color: #555;
    }
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
        text-align: center;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .modal-title {
        font-size: 1.5em;
        color: #333;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
    }

    .settings-options {
        text-align: center;
    }

    .settings-title {
        margin-bottom: 15px;
        color: #555;
    }



    .settings-button, .chart-type-toggle {
        padding: 10px 20px;
        font-size: 1em;
        font-weight: 600;
        color: #333;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: block;
        width: calc(100% - 40px);
        margin: 10px auto;
        text-align: center;
    }

    .settings-button:hover, .chart-type-toggle:hover {
        background-color: #e0e0e0;
        border-color: #bbb;
    }

    .settings-button:active, .chart-type-toggle:active {
        background-color: #d0d0d0;
        border-color: #aaa;
    }


</style>
