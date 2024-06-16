<script>
    import RMADetailsModal from "./RMADetailsModal.svelte";

    export let approvedRmaData = [];

    let isModalOpen = false;


    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    let selectedRma = null;

    function openRMADetails(rma) {
        console.log("Opening RMA details for:", rma);
        selectedRma = rma;
    }


</script>

<!-- to toggle the modal -->
<button
        on:click={toggleModal}
        class="block text-white bg-primary-800 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        type="button">

    Process Return
</button>

<!-- main modal -->
{#if isModalOpen}
    <div class="modal-backdrop fixed inset-0 z-40">
        <div class="centered-modal w-full h-full">
            <div id="select-modal" tabindex="-1" aria-hidden="true" class="relative p-4 w-full max-w-md max-h-full m-auto">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Select an RMA
                        </h3>
                        <button on:click={toggleModal} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="select-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-4 md:p-5">
                        <ul class="space-y-4 mb-4">
                            {#each approvedRmaData as rma (rma.rmaId)}
                                <li on:click={() => openRMADetails(rma)} class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">RMA ID: {rma.rmaId}</div>
                                        <div class="w-full text-gray-500 dark:text-gray-400">Customer: {rma.customerId}</div>
                                        <div class="w-full text-gray-500 dark:text-gray-400">Status: {rma.status}</div>
                                    </div>
                                    <svg class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

{#if selectedRma}
    <RMADetailsModal {selectedRma} />
{/if}




<style>
    .modal-backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }

    .centered-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
