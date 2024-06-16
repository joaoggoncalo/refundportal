<script>

    import Form from "../../components/Form.svelte";
    import Input from "../../components/Input.svelte";
    import {onMount} from "svelte";
    import {timeOut} from "../../lib/util.js";

    export let params;
    let selectedItemId = -1;
    let rmaNumber = localStorage.getItem('rmaNumber');
    let productStatus;
    let processStatus;
    let damageDescription;
    let itemToDisplay;
    let pendingId = [-1];
    let loading = true;


    let rmaItems = [
        {id: 0, name: 'Item 1', productId: 0, status: 'Available', damageDescription: '', damageImage: ''},
        {id: 1, name: 'Item 2', productId: 0, status: 'Available', damageDescription: '', damageImage: ''},
        {id: 2, name: 'Item 3', productId: 0, status: 'Available', damageDescription: '', damageImage: ''},
        {id: 3, name: 'Item 4', productId: 0, status: 'Available', damageDescription: '', damageImage: ''},
    ];

    const dropdownOptions = [
        {value: 'Available', label: 'Available'},
        {value: 'Damaged', label: 'Damaged'},
        {value: 'Missing', label: 'Missing'},
    ];


    function getItemsConditions() {
        let remoteItemsConditions = JSON.parse(localStorage.getItem('rmaItems'));
        if (remoteItemsConditions) {
            rmaItems = remoteItemsConditions;
        }
    }


    async function fetchRmaItems() {
        try {
            rmaNumber = JSON.parse(rmaNumber);
            const response = await fetch(`http://localhost:3000/returns/${rmaNumber}/return-items`);

            if (response.ok) {
                try {
                    const result = await response.json();
                    rmaItems = result.map(items => ({
                        id: items.rmaItemId,
                        name: items.productId,
                        productId: items.productId,
                        productStatus: items.productStatus,
                        processStatus: items.processStatus,
                        damageDescription: '',
                        damageImage: ''
                    }));
                } catch (error) {
                    console.error('Returns items API request failed:', response.status);
                }


                await Promise.all(rmaItems.map(async items => {
                    try {
                        let productsNameResponse = await fetch(`http://localhost:3000/products/${items.productId}`);
                        if (productsNameResponse.ok) {
                            const product = await productsNameResponse.json();
                            items.name = product.name;
                        } else {
                            console.error('Products API request failed:', productsNameResponse.status);
                        }
                    } catch (error) {
                        console.error('Error fetching or parsing product data:', error);
                    }
                }));
                return Promise.resolve();
            }
        } catch (error) {
            console.error('Error fetching rma items: ', error);
        } finally {
            loading = false;
        }
    }

    onMount(async () => {
        let wentBack = JSON.parse(localStorage.getItem('wentBack'));
        if (wentBack) {
            getItemsConditions();
            loading = false;
        } else
            await fetchRmaItems();
        selectedItemId = -1;
    });

    function selectItem(id) {
        itemToDisplay = rmaItems.find(item => item.id === id);
        productStatus = itemToDisplay.productStatus;
        processStatus = itemToDisplay.processStatus;
        damageDescription = itemToDisplay.damageDescription;
        selectedItemId = itemToDisplay.id;
        if (!pendingId.includes(selectedItemId))
            pendingId.push(selectedItemId);
    }

    let handleFormSubmit = (event) => {
        const {...formData} = event.detail;

        itemToDisplay.productStatus = formData[`status-${selectedItemId}`]
        itemToDisplay.damageDescription = formData[`damageDescription-${selectedItemId}`];
        if (formData[`image-${selectedItemId}`]) {
            itemToDisplay.damageImage = formData[`image-${selectedItemId}`];
        }

        setTimeout(() => {
            rmaItems = rmaItems;
        });
    }


    function handleSubmitButton() {
        localStorage.setItem('rmaItems', JSON.stringify(rmaItems));
        window.location.href = 'overview';
    }

    //Log out user if inactive for 2 hours
    timeOut();
</script>


{#if loading}
    <p>Loading...</p>
{:else}
    <div class="flex flex-col md:flex-row m-4 md:m-8 lg:m-12">


        <div class="flex-1 flex-row bg-gray-300 md:flex-row justify-center ">
            <div class="bg-blue-200 p-4 m-2">Order: {rmaNumber}</div>
            <div class="bg-blue-200 p-4 m-2">Items:</div>
            <div class=" flex-row justify-center">
                {#each rmaItems as item}
                    <div
                            class="note-condition bg-blue-200 p-4 m-2 flex-1"
                            class:submitted={ !(item.productStatus === null) && !(selectedItemId === item.id)}
                            class:selected={selectedItemId === item.id}
                            on:click={() => selectItem(item.id)}
                            role="button"
                            tabindex="0"
                    >
                        {item.name}
                    </div>
                {/each}
            </div>
        </div>


        <div class="flex-1 p-4 m-3">

            <Form on:submit={handleFormSubmit}
                  formClass="flex flex-col bg-gray-400 rounded-xl p-6 items-center"
                  buttonText="SUBMIT"
                  buttonClass="bg-gray-500 p-3 mt-4 rounded-xl max-w-xl px-10">
                <div class="flex flex-row">

                    <div class="flex flex-col">
                        {#if selectedItemId === -1}
                            <p>Please select a product to change it's details</p>
                        {:else}

                            {#each rmaItems as item}
                                <div class="{selectedItemId === item.id ? 'flex' : 'hidden'} flex-col ml-5">

                                    <Input inputType="dropDown"
                                           labelText={`${item.name}'s status`}
                                           labelClassName="flex flex-col"
                                           inputValue={productStatus}
                                           inputName={`status-${item.id}`}
                                           options={dropdownOptions}
                                    />

                                    <Input inputType="textarea"
                                           labelText={`${item.name}'s damage description`}
                                           labelClassName="flex flex-col"
                                           inputName={`damageDescription-${item.id}`}
                                           inputClassName="textarea mb-4 p-1.5 outline-none rounded text-black"
                                           placeholder="{damageDescription}"
                                           inputValue={damageDescription}
                                    />

                                    <Input inputType="file"
                                           labelClassName="bg-grey-300"
                                           inputClassName="file-input mb-4"
                                           inputName={`image-${item.id}`}
                                    />
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </Form>
        </div>
    </div>
    <div class="flex justify-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleSubmitButton}>
            Submit all
        </button>
    </div>
{/if}


<style>
    .note-condition.selected {
        background-color: red;
    }

    .note-condition.submitted {
        background-color: green;
    }


</style>
