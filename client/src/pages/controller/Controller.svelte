<script>
    import router from 'page';
    import DataService from '../../DataService.js';
    import {onMount} from 'svelte';
    import ProcessReturnButton from './ProcessReturnButton.svelte';
    import {token} from "../../store";
    import {notifyCustomerOfRefundStatus} from '../../../fetchAPI.js';
    import noImage from '../../assets/No-Image-Placeholder.svg.png';

    const dataService = new DataService('http://localhost:3000');

    let rmaData = [];
    let approvedRmaData = [];
    let returnItems = [];
    let lockError = "";

    onMount(async () => {
        try {
            rmaData = await dataService.fetchRMATableData();
            console.log(rmaData);
            rmaData = rmaData.map(rma => ({...rma, returnItems: [], isDetailsVisible: false}));
            approvedRmaData = rmaData.filter(rma => rma.status.toLowerCase() === 'received'
                //|| rma.status.toLowerCase() === 'rejected'
            );
        } catch (error) {
            console.error('Failed to fetch RMA data:', error);
        }
    });

    async function getReturnItems(rmaId) {
        const detailsIndex = rmaData.findIndex(rma => rma.rmaId === rmaId);
        if (detailsIndex !== -1) {
            try {
                rmaData[detailsIndex].returnItems = await dataService.fetchReturnItems(rmaId);
            } catch (error) {
                console.error('Failed to fetch return items:', error);
            }
        }
    }

    function toggleDetails(rmaId) {
        const detailsIndex = rmaData.findIndex(rma => rma.rmaId === rmaId);
        if (detailsIndex !== -1) {
            rmaData[detailsIndex].isDetailsVisible = !rmaData[detailsIndex].isDetailsVisible;
            if (rmaData[detailsIndex].isDetailsVisible && rmaData[detailsIndex].returnItems.length === 0) {
                getReturnItems(rmaId);
            }
        }
    }


    async function getCustomerOfReturn(returnId) {
        try {
            const response = await fetch(`http://localhost:3000/returns/${returnId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data.customerId;
            }
        } catch (e) {
            console.log(e);
        }
    }

    //    async function notifyClientForStatus(returnItem, status) {
    //        try {
    //            // FIXME: fetch the customerId as it wouldn't currently work
    //            // change the backend fetch to perform the action depending on the status passed
    //            const userId = await getCustomerOfReturn(returnItem.rmaId);
    //            const response = await fetch(`http://localhost:3000/customers/${userId}/notifications`, {
    //                method: 'POST',
    //                headers: {
    //                    // 'Authorization': `Bearer ${$tokenStore.token}`,
    //                    'Content-Type': 'application/json'
    //                },
    //                body: JSON.stringify(status)
    //            });
    //            if (response.ok) {
    //                const data = await response.json();
    //                console.log(data);
    //            } else {
    //                const errorData = await response.json();
    //                console.error(`Error: ${response.status} - ${errorData.error}`);
    //            }
    //        } catch (e) {
    //            console.log(e);
    //        }
    //    }

    async function updateRefundRequest(returnItem, processStatus) {
        returnItem.processStatus = processStatus;
        try {

            const response = await fetch(`http://localhost:3000/return-items/${returnItem.rmaItemId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${$token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(returnItem)
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                const userId = await getCustomerOfReturn(returnItem.rmaId);

                try {
                    const notifyData = await notifyCustomerOfRefundStatus(userId, returnItem.productId, returnItem.productStatus, returnItem.processStatus, returnItem.damageDescription, returnItem.damageImage);
                    alert(notifyData.message);
                } catch (notifyError) {
                    alert(notifyError.message);
                }

                rmaData = rmaData;
                router('/controller');
            } else {
                // errorMessage = "Invalid input / All fields must be filled";
                const errorData = await response.json();
                if (errorData.error.some(str => str.includes("managed by"))) {
                    lockError = "This return is managed by another employee";
                }
                console.error(`Error: ${response.status} - ${errorData.error}`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function getItemName(productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.log(e);
        }
    }
</script>

<div class="bg-white p-8 rounded-md w-full">
    <!-- button to process a return -->
    <div class="flex items-center justify-between pb-6">
        <div class="process-button">
            <ProcessReturnButton {approvedRmaData}/>
        </div>
    </div>
    <div>
        <!-- table with all the rma's -->
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table class="min-w-full leading-normal">
                    <thead>
                    <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            RMA ID
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Customer
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Request Date
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            status
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each rmaData as rma}
                        {#if (rma.status === 'received')}
                            <tr>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rma.rmaId}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rma.customerId}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rma.createdDate}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{rma.status}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            on:click={() => toggleDetails(rma.rmaId)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                            {#if rma.isDetailsVisible}
                                <tr class="bg-primary-950">
                                    <td colspan="5" class="px-5 py-5 border-b border-gray-200 bg-white">
                                        <ul class="list-none p-4">
                                            {#each rma.returnItems as item}
                                                {#await getItemName(item.productId)}
                                                    <p>Loading...</p>
                                                {:then product}
                                                    {#if item.damageImage === null}
                                                        <li><img class="object-contain object-left h-48 w-96"
                                                                 src={noImage} alt=""></li>
                                                    {:else}
                                                        <li><img class="pt-6 object-contain object-left h-48 w-96"
                                                                 src="{item.damageImage}" alt="{product.name}"></li>
                                                    {/if}
                                                    <li>{product.name}: {item.productStatus}</li>
                                                    <li>{item.damageDescription}</li>
                                                    {#if (item.processStatus !== "Approved" && item.processStatus !== "Declined")}
                                                        <li class="approveButton">
                                                            <button class="bg-primary-500 hover:bg-primary-600 text-white font-semibold hover:text-black py-2 px-4 hover:border-transparent rounded"
                                                                    on:click|preventDefault={() => updateRefundRequest(item, "Approved")}>
                                                                Approve request
                                                            </button>
                                                            <button class="bg-primary-500 hover:bg-primary-600 text-white font-semibold hover:text-black py-2 px-4 hover:border-transparent rounded"
                                                                    on:click|preventDefault={() => updateRefundRequest(item, "Declined")}>
                                                                Decline request
                                                            </button>
                                                        </li>
                                                    {:else }
                                                        <p>Item processed!</p>
                                                    {/if}
                                                    <li>{lockError}</li>
                                                {/await}
                                            {/each}
                                        </ul>
                                    </td>
                                </tr>
                            {/if}
                        {/if}
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
