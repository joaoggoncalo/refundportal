<script>
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let inputType, inputName;
    export let labelText = "", inputValue = "", inputClassName = "", labelClassName = "", placeholder = "";
    export let checked = false, disabled = false;
    export let options = [];

    const handleCheckboxChange = () => {
        dispatch('change', {checked});
    }
</script>

<label for={inputName} class={labelClassName}>
    {#if labelText !== ""}
        <span>{labelText}</span>
    {/if}
    {#if inputType === 'text'}
        <input type="text" class={inputClassName} bind:value={inputValue} name={inputName} {placeholder} {disabled}/>
    {:else if inputType === 'password'}
        <input type="password" class={inputClassName} bind:value={inputValue} name={inputName} {placeholder}
               {disabled}/>
    {:else if inputType === 'number'}
        <input type="number" class={inputClassName} bind:value={inputValue} name={inputName} {placeholder} {disabled}/>
    {:else if inputType === 'checkbox'}
        <input type="checkbox" class={inputClassName} bind:checked={checked} name={inputName} {placeholder} {disabled}
               on:change={handleCheckboxChange}/>
    {:else if inputType === 'file'}
        <input type="file" class={inputClassName} bind:value={inputValue} name={inputName} {placeholder} {disabled}/>
    {:else if inputType === 'textarea'}
        <textarea class={inputClassName} bind:value={inputValue} name={inputName} {placeholder} {disabled}/>
    {:else if inputType === 'dropDown'}
        <select class={inputClassName} bind:value={inputValue} name={inputName} {placeholder} {disabled}>
            {#each options as option}
                <option value={option.value}>{option.label} </option>
            {/each}
        </select>
    {/if}
</label>

