<script>
    let inputValue = '';
    export let submit, placeholder = "Enter text";

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            inputValue = event.target.value.trim();
            console.log('Input value:', inputValue);

            if (typeof submit === 'function') {
                submit(inputValue);
                console.log('Submit event emitted with value:', inputValue);
            }
        }
    }
</script>
<div class="flex justify-center items-center min-h-screen">
    <div class="w-full sm:w-3/4 lg:w-2/3 px-6 py-4 text-center">
        <input type="text" bind:value={inputValue} on:keydown={handleKeyPress} class="w-full lg:w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" id="textField" placeholder={placeholder} >
        <p id="errorLabel" class="text-red-500"></p>
    </div>
</div>
