<script>
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let buttonClass, buttonText, formClass;
    export let disableSubmit = false;
    let form;

    const handleSubmit = () => {
        let formData = new FormData(form);
        let json = {};
        formData.forEach((value, key) => {
            json[key] = value;
        });

        dispatch('submit', json);
    }
</script>

<form bind:this={form} on:submit|preventDefault={handleSubmit} class={formClass}>
    <slot/>
    <button type="submit" class={buttonClass} on:click={handleSubmit} disabled={disableSubmit}>{buttonText}</button>
</form>