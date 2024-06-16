<script>
    import Input from '../../components/Input.svelte';
    import Form from '../../components/Form.svelte';
    import {fetchData, postData} from "../../lib/util.js";
    import {token, user} from "../../store.js";
    import {onMount} from "svelte";
    import page from "page"
    import Modal from "../../components/InfoModal.svelte";

    export let params;
    let error = "", disableSubmit = false;
    let items = [];

    onMount(async () => {
        try {
            const fetchedOrder = await fetchData(`http://localhost:3000/users/${$user.id}/orders/${params.orderId}`, $token);
            items = fetchedOrder.items.map(item => ({
                ...item,
                isSelected: false,
                isFocused: false
            }));
        } catch (error) {
            console.error('Error fetching items: ', error);
        }
    });


    let selectedProductId = null;

    const selectItem = (productId) => {
        selectedProductId = productId;
    }

    const focusOnItem = (productId, event) => {
        items.forEach(el => el.isFocused = false)
        const itemIndex = items.findIndex(item => item.productId === productId);
        if (itemIndex !== -1) {
            items[itemIndex].isFocused = true;
            items = [...items];
        }
    }

    const handleCheckboxChange = (productId, event) => {
        const itemIndex = items.findIndex(item => item.productId === productId);
        if (itemIndex !== -1) {
            items[itemIndex].isSelected = event.detail.checked;
            items = [...items];
        }
    }

    const handleFormSubmit = async (event) => {
        const selectedItems = items.filter(item => item.isSelected);
        selectedItems.forEach(item => {
            if (!item) {
                console.error('Undefined item found!');
            }
        });

        const {...formData} = event.detail;

        const payload = {
            orderId: params.orderId,
            items: items.filter(item => item.isSelected).map(item => ({
                productId: item.productId,
                comments: formData[`comments-${item.productId}`] || '',
                image: item.image === 'none' ? 'none' : item.image?.name
            }))
        };

        if (disableSubmit) return;
        disableSubmit = true;

        const response = await postData(`http://localhost:3000/users/${$user.id}/returns`, $token, payload)
        if (response.error) {
            error = response.error + ". Please try again";
            disableSubmit = false;
            return
        }
        page(`/customer/${$user.id}/orders/${response.rmaId}/success`)
    }

    let modalClose = () => {
        error = "";
    };

</script>

<main class="flex justify-center text-black p-4">

    {#if error}
        <Modal header="Hey!" info={error} on:modalClose={modalClose}/>
    {/if}

    <div class="flex flex-col rounded-xl bg-gray-100 border-[1px] border-gray-300">
        <p class="bg-gray-300 p-3 rounded-t-xl font-bold text-2xl">Create new refund</p>
        <p class="border-b-[1px] border-b-gray-400 px-3 py-2 text-base font-light italic">
            1). Click on the item in the list to select it <br>
            2). Check the checkbox if you want to include this item in your refund <br>
            3). Please let us know why you are returning the item, we would like to know! <br>
            4). Add an image if applicable
        </p>
        <Form on:submit={handleFormSubmit}
              formClass="flex flex-col p-6 items-center"
              buttonText="SUBMIT"
              buttonClass="bg-gray-300 p-3 mt-4 rounded-xl max-w-xl px-10">
            <div class="flex flex-row">
                <div class="flex flex-col mb-4">
                    {#each items as item(item.productId)}
                        <div class="flex items-center p-2 rounded mb-1 w-full"
                             class:border-gray-300={!item.isSelected} class:border-[1px]={!item.isSelected}
                             class:bg-gray-300={item.isSelected}
                             class:bg-green-500={item.isFocused}
                             on:click={(event) => focusOnItem(item.productId, event)}
                             role="button" tabindex="0" on:keydown={(event) => focusOnItem(item.productId, event)}>
                            <Input inputType="checkbox"
                                   checked={item.isSelected}
                                   inputClassName="mr-2"
                                   inputName={`selected-${item.productId}`}
                                   on:change={(event) => handleCheckboxChange(item.productId, event)}/>
                            <div class="cursor-pointer whitespace-nowrap"
                                 role="button" tabindex="0" on:keydown={()=>selectItem(item.productId)}
                                 on:click={() => selectItem(item.productId)}>
                                {item.name}
                            </div>
                        </div>
                    {/each}
                </div>
                <div class="flex flex-col">
                    {#each items as item(item.productId)}
                        <div class="{selectedProductId === item.productId ? 'flex' : 'hidden'} flex-col ml-5">
                            <Input inputType="textarea"
                                   labelText={`Comments for ${item.name}`}
                                   labelClassName="flex flex-col mb-1"
                                   bind:inputValue={item.comments}
                                   inputClassName="textarea mb-4 p-1.5 outline-none rounded text-black bg-white"
                                   inputName={`comments-${item.productId}`}
                                   placeholder="Enter your comments here"
                                   disabled={!item.isSelected}/>
                            <Input inputType="file"
                                   labelClassName="bg-grey-300"
                                   inputClassName="file-input mb-4"
                                   inputName={`image-${item.productId}`}
                                   disabled={!item.isSelected}/>
                        </div>
                    {/each}
                </div>
            </div>
        </Form>
    </div>
</main>