<!-- SelectionField.svelte -->

<script>
    export let list, name, value;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();


    let selected_option = '';

    function selectOption() {
        dispatch('message', {
            value: selected_option
        });
    }
</script>

<div class="max-w-sm mx-auto">
    <label for={name} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{name}</label>
    <select id={name} bind:value={selected_option} on:change={selectOption}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {#if list.length > 0 }
            <option disabled selected placeholder="" class="hidden"></option>
            {#each list as listItem}
                {#if listItem.username}
                    <option value={listItem.username}>{listItem.username} </option>
                {/if}
                {#if listItem.status}
                    <option value={listItem.status}>{listItem.status} </option>
                {/if}
            {/each}
        {/if}
    </select>
</div>
