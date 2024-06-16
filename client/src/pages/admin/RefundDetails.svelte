<script>

    import {onMount} from "svelte";
    import SideNavigator from "./dashboard/SideNavigator.svelte";
    import {createEventDispatcher} from 'svelte';
    import {token} from "../../store.js";

    const dispatch = createEventDispatcher();
    export let params

    let result;
    let controller, collector, rmaId, status, customer, itemName
    let listOfItems = []
    let controllerList = [];
    let collectorList = [];
    let customerList = [];
    let isDataLoaded = false;
    let rmaStatus = [{status: "received"},
        {status: "in transit"},
        {status: "process"}]

    let processStatus = [{processStatus: "fulfilled"},
        {processStatus: "rejected"}]
    let productStatus = [{productStatus: "damaged"},
        {productStatus: "missing"},
        {productStatus: "available"}]
    let collectedBy;
    let controlledBy;
    let customerUsername;
    let form;
    let rmaResult;
    let isSidebarVisible = true;
    let contentMargin = '256px';

    $: {
        contentMargin = isSidebarVisible ? '256px' : '0px';
    }

    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
    }


    async function fetchRmaById() {
        try {
            const response = await fetch(`http://localhost:3000/returns/${params.rmaId}`, {
                method: 'GET',
            });
            if (response.ok) {
                result = await response.json();
                rmaResult = result
                rmaId = result.rmaId
                status = result.status
                const customerResponse = await fetch(`http://localhost:3000/users/${result.customerId}`, {
                    method: 'GET',
                });
                if (customerResponse.ok) {
                    const customerResp = await customerResponse.json();
                    customerUsername = customerResp.username
                }
                const collectorResponse = await fetch(`http://localhost:3000/users/${result.collectorId}`, {
                    method: 'GET',
                });
                if (collectorResponse.ok) {
                    const collectorResp = await collectorResponse.json();
                    collectedBy = collectorResp.username
                }
                const controllerResponse = await fetch(`http://localhost:3000/users/${result.controllerId}`, {
                    method: 'GET',
                });
                if (controllerResponse.ok) {
                    const controllerResp = await controllerResponse.json();

                    controlledBy = controllerResp.username
                }
            }

        } catch (error) {
            console.error('Error fetching rma by Id: ', error);
        }
    }

    async function fetchItemsByRmaId() {
        try {
            const response = await fetch(`http://localhost:3000/returns/${rmaId}/return-items`, {
                method: 'GET',
            });
            if (response.ok) {
                result = await response.json()
                listOfItems = result
                for (const item of listOfItems) {
                    const productResponse = await fetch(`http://localhost:3000/products/${item.productId}`, {
                        method: 'GET',
                    });
                    if (productResponse.ok) {
                        const productResult = await productResponse.json();
                        console.log(itemName)
                        item.name = productResult.name;
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching items by rmaId: ', error);
        }
    }

    async function fetchDropDownDetails() {
        try {
            const response = await fetch(`http://localhost:3000/users/`, {
                method: 'GET',
            });
            if (response.ok) {
                const result = await response.json();
                const users = result.users;

                for (const user of users) {
                    if (user.role === 1 || user.role === 4) {
                        collectorList.push(user);
                        console.log(" here")
                    }
                    if (user.role === 1 || user.role === 3) {
                        controllerList.push(user);
                    }
                    if (user.role === 2) {
                        customerList.push(user);
                    }
                }
                console.log(collectorList)

            }


        } catch (error) {
            console.error('Error fetching items by rmaId: ', error);
        }
    }


    onMount(async () => {
        await fetchRmaById();
        await fetchItemsByRmaId()
        await fetchDropDownDetails()
        isDataLoaded = true;
    });


    const handleSubmit = () => {
        const isConfirmed = window.confirm('Are you sure you want to confirm the changes?');
        if (isConfirmed) {
            let formData = new FormData(form);
            let json = {};

            console.log("Before Form Submission - rmaResult:", rmaResult);
            console.log("Before Form Submission - listOfItems:", listOfItems);

            formData.forEach((value, key) => {
                json[key] = value;
                console.log(key + ":" + value)
            });

            // Update rmaResult properties
            for (const key in json) {
                if (rmaResult.hasOwnProperty(key)) {
                    rmaResult[key] = json[key];
                }
            }

            // Update listOfItems properties
            for (const item of listOfItems) {
                for (const key in json) {
                    if (item.hasOwnProperty(key) && key !== "status") {
                        item[key] = json[key];
                    }
                }
                sendListOfItemsToBackend(item);
            }

            console.log("After Form Submission - rmaResult:", rmaResult);
            console.log("After Form Submission - listOfItems:", listOfItems);
            sendRmaResultToBackend()

            dispatch('submit', json);
        }
    }
    async function sendRmaResultToBackend(){
        try {
            const response = await fetch(`http://localhost:3000/returns/${rmaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+$token
                },
                body: JSON.stringify(rmaResult),
            });

            if (response.ok) {
                console.log('RmaResult successfully sent to the backend');
            } else {
                console.error('Failed to send RmaResult to the backend');
            }
        } catch (error) {
            console.error('Error sending RmaResult to the backend:', error);
        }
    }
    async function sendListOfItemsToBackend(item){
        try {
            const response = await fetch(`http://localhost:3000/return-items/${item.rmaItemId}`, {
                method: 'PATCH',  // Use the appropriate HTTP method for your backend API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+$token
                },
                body: JSON.stringify(item),
            });

            if (response.ok) {
                console.log(`Item with productId ${item.productId} successfully sent to the backend`);
            } else {
                console.error(`Failed to send Item with productId ${item.productId} to the backend`);
            }
        } catch (error) {
            console.error(`Error sending Item with productId ${item.productId} to the backend:`, error);
        }
    }

</script>
<SideNavigator {isSidebarVisible} {toggleSidebar} />
<section class="flex justify-center" style="margin-left: {contentMargin}; transition: margin-left 0.3s;">
    {#if isDataLoaded}
    <!--<RefundDetailsComponent rmaId={rmaId} status={status}, controller={controller} collector={collector}-->
    <!--                        customer={customer} listOfItems={listOfItems} itemName={itemName}-->
    <!--                        dropDownCollector={collectorList} dropDownController={controllerList} dropDownCustomer={customerList} dropDownStatus={rmaStatus} dropDownItemStatus={rmaStatus} inputName="Damage description"></RefundDetailsComponent>-->


    <form bind:this={form} class="max-w-md mx-auto" on:submit|preventDefault={handleSubmit}>
        <p style="margin-bottom: 3px">Details of RMA with Id: {rmaId}</p>
        <div class="relative z-0 w-full mb-5 group">
            <p>Collected by: </p>
            <select  bind:value={collectedBy} name="collectorId" id="collector_select"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    style="line-height: 1.5;" placeholder="">
                <option class="hidden" disabled selected>{collectedBy}</option>
                {#each collectorList as collector}
                    <option value={collector.username}>{collector.username}</option>
                {/each}
            </select>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <p>Controlled by: </p>
            <select bind:value={controlledBy} name="controllerId" id="controller_select"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    style="line-height: 1.5;" placeholder=" ">
                <option class="hidden" disabled selected>{controlledBy}</option>
                {#each controllerList as controller}
                    <option value={controller.username}>{controller.username}</option>
                {/each}
            </select>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <p>Customer username: </p>
            <select bind:value={customerUsername} name="customerId" id="customer_select"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    style="line-height: 1.5;">
                <option  class="hidden" disabled selected>{customerUsername}</option>
                {#each customerList as customer}
                    <option value={customer.username}>{customer.username}</option>
                {/each}
            </select>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <div class="relative z-0 w-full mb-5 group">
                <p>RMA status: </p>
                <select bind:value={status} name="status" id="rma_status"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        style="line-height: 1.5;" placeholder=" ">
                    <option class="hidden" disabled selected>{status}</option>
                    {#each rmaStatus as rma}
                        <option value={rma.status}>{rma.status}</option>
                    {/each}
                </select>
            </div>

        </div>
        <div class="grid md:grid-cols-2 md:gap-6">
            {#each listOfItems as item (item.productId)}
                <div class="mb-3 border-b border-gray-300">
                    <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">Product: {item.name}</p>
                    <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">Damage
                        description:

                        <label for="small-input"
                               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
                        <input bind:value={item.damageDescription} type="text" id={`small-input-${item.productId}`} name={`damageDescription-${item.productId}`}
                               class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

                        <!--                    <p class="mb-1 font-bold text-gray-700 dark:text-gray-400">Current status: {item.status}-->
                        <!--add a dropdown menu -->
                    <p>Process status: </p>
                    <select bind:value={item.processStatus} name={`status-${item.productId}`} id={`item_status-${item.productId}`}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            style="line-height: 1.5;" placeholder=" ">

                        <option class="hidden" disabled selected>{item.processStatus}</option>
                        {#each processStatus as itemStatus}
                            <option value={itemStatus.processStatus}>{itemStatus.processStatus}</option>
                        {/each}
                    </select>
                    <p>Product status: </p>
                    <select bind:value={item.productStatus} name={`productStatus-${item.productId}`} id={`productStatus-${item.productId}`}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            style="line-height: 1.5;" placeholder=" ">

                        <option class="hidden" disabled selected>{item.productStatus}</option>
                        {#each productStatus as ItemProductStatus}
                            <option value={ItemProductStatus.productStatus}>{ItemProductStatus.productStatus}</option>
                        {/each}
                    </select>
                </div>
            {/each}
        </div>
        <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Confirm changes
        </button>
    </form>

{:else}
    <p>Loading...</p>
{/if}

</section>