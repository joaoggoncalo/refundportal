<script>
    import {createEventDispatcher} from 'svelte';

    export let className = "", text, role = "button"

    const dispatch = createEventDispatcher();

    const handleOnClick = () => {
        dispatch('click');
    }

</script>

<button role={role} class={`bg-slate-500 rounded-2xl p-1.5 text-slate-100 ${className}`} on:click={handleOnClick}>
    {#if {text}}
        {text}
    {/if}
    <slot/>
</button>