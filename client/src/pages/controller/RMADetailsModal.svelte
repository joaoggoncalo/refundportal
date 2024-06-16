<script>
    import DataService from '../../DataService.js';
    import {onMount} from 'svelte';
    import {token} from "../../store.js";

    export let selectedRma;
    let returnItems = [];
    let totalRefundAmount = 0;
    let allItemsProcessed = false;
    let showToast = false;

    const dataService = new DataService('http://localhost:3000');


    function hideToast() {
        showToast = false;
    }

    async function getItemName(productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchReturnItems() {
        if (!selectedRma) return;
        try {
            const items = await dataService.fetchReturnItems(selectedRma.rmaId);
            const itemsWithDetails = await Promise.all(items.map(async (item) => {
                const productDetails = await getItemName(item.productId);
                return {...item, productName: productDetails.name, price: productDetails.price};
            }));

            returnItems = itemsWithDetails;
            calculateTotalRefundAmount();
            updateItems(itemsWithDetails);
        } catch (error) {
            console.error('Failed to fetch return items:', error);
            returnItems = [];
        }
    }

    function calculateTotalRefundAmount() {
        totalRefundAmount = returnItems.reduce((total, item) => {

            if (item !== null && item.processStatus !== null && item.processStatus.toLowerCase() === 'approved') {
                return total + (item.price || 0);
            }
            return total;
        }, 0);
    }

    $: if (selectedRma) {
        fetchReturnItems();
    }

    onMount(() => {
        if (selectedRma) {
            fetchReturnItems();
        }
    });

    function closeModal() {
        selectedRma = null;
    }

    function getStatusClass(status) {
        if (status !== null) {
            switch (status.toLowerCase()) {
                case 'approved' :
                    return "approved"
                case 'declined' :
                    return "declined"
                default:
                    return ""
            }
        } else
            return "pending"
    }


    function checkAllItemsProcessed() {
        allItemsProcessed = returnItems.every(item =>
            (item.processStatus !== null && item.processStatus.toLowerCase() === 'approved') ||
            (item.processStatus !== null && item.processStatus.toLowerCase() === 'declined')
        );
    }


    function updateItems(items) {
        returnItems = items;
        checkAllItemsProcessed();
    }

    async function processReturn() {
        try {
            const response = await fetch(`http://localhost:3000/returns/${selectedRma.rmaId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${$token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: selectedRma.orderId,
                    customerId: selectedRma.customerId,
                    createdDate: selectedRma.createdDate,
                    status: 'processed',
                    // returnReason: selectedRma.returnReason,
                    collectorId: selectedRma.collectorId,
                    controllerId: selectedRma.controllerId
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(`Error: ${response.status} - ${error.error}`);
                throw new Error('Failed to update RMA status');
            }

            const result = await response.json();
            console.log('Return processed:', result);

            showToast = true;

            setTimeout(() => {
                showToast = false;
                window.location.href = window.location.pathname;
            }, 3000);

        } catch (error) {
            console.error('Error processing return:', error);
        }
    }

</script>

{#if showToast}
    <div id="toast-success"
         class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
         role="alert">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                 viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span class="sr-only">Check icon</span>
        </div>
        <div class="ml-3 text-sm font-normal">Return processed successfully.</div>
        <button type="button"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                on:click={hideToast}>
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    </div>
{/if}

{#if selectedRma}
    <div id="notification-container"></div>
    <div class="modal-backdrop fixed inset-0 z-50">
        <div class="centered-modal w-full h-full">
            <div class="relative p-4 w-full max-w-md max-h-full m-auto">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            RMA Details
                        </h3>
                        <button on:click={closeModal} type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-4 md:p-5">
                        <p class="mb-4">RMA ID: {selectedRma.rmaId}</p>
                        <p class="mb-4">Customer: {selectedRma.customerId}</p>
                        <!-- Add more details as needed -->
                        <ul class="list-none p-4">
                            {#each returnItems as item}
                                <li class={`item ${getStatusClass(item.processStatus)}`}>
                                    {item.productName || 'Loading...'}:
                                    {item.processStatus !== null ? item.processStatus : "pending"} - €{item.price}
                                </li>
                            {/each}
                        </ul>
                        {#if totalRefundAmount > 0}
                            <p>Total amount being refunded: €{totalRefundAmount.toFixed(2)}</p>
                        {/if}

                        {#if allItemsProcessed}
                            <button class="process-return-button" on:click={processReturn}>Process Return</button>
                        {:else}
                            <button class="process-return-button disabled" disabled>
                                All items need to be approved or declined before processing return
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
    }

    .centered-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .item {
        padding: 10px;
        margin-bottom: 5px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .approved {
        background-color: #d4edda;
        color: #155724;
    }

    .declined {
        background-color: #f8d7da;
        color: #721c24;
    }

    .pending {
        background-color: #e8e4e4;
        color: #721c24;
    }

    .process-return-button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
    }

    .process-return-button.disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .process-return-button:not(.disabled):hover {
        background-color: #45a049;
    }

    #notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }

    .notification {
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        margin-bottom: 15px;
        text-align: center;
        border-radius: 4px;
    }

    #toast-success {
        z-index: 100;
        position: fixed;
        top: 20px;
        right: 20px;
    }
</style>