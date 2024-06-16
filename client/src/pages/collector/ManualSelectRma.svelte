<script>
    import { onMount } from 'svelte';
    import { patchData, timeOut } from "../../lib/util.js";
    import { token, user } from "../../store.js";
    import page from "page";
    import TextField from "../../components/TextField.svelte";

    let rmaNumber;
    let errorLabel;

    function handleInputSubmit(inputValue) {
        if (isNaN(inputValue) || !inputValue) {
            errorLabel.textContent = 'Please enter a number';
        } else {
            rmaNumber = parseFloat(inputValue);
            fetchRmaNumber();
        }
    }

    async function fetchRmaNumber() {
        try {
            const response = await fetch(`http://localhost:3000/returns/${rmaNumber}`);

            if (response.ok) {
                try {
                    const result = await response.json();
                    if(result.status === 'in transit'){
                        patchRma(result);

                        localStorage.setItem('rmaNumber', JSON.stringify(rmaNumber));
                        let goBack = false;
                        localStorage.setItem('wentBack', JSON.stringify(goBack));
                        page.redirect('./review');
                    }
                    else{
                        alert("Cannot get this RMA (someone else has scanned it)")
                    }
                } catch (error) {
                    console.error('RMA API request failed:', response.status);
                    console.error(error);

                }
            }
        } catch (error) {
            alert('Invalid QR code');
            console.error('Error fetching rma: ', error);
        }
    }

    function patchRma(result) {
        let payload = result;
        payload.status = 'in-process';
        payload.collectorId = $user.id;

        patchData(`http://localhost:3000/returns/${rmaNumber}`, $token, payload);
    }

    onMount(() => {
        timeOut();
    });
</script>

<div class="flex flex-col justify-evenly min-h-screen">
        <h2 class="text-4xl text-center mt-20">Input the RMA number to proceed</h2>
        <TextField placeholder="Enter RMA id" submit={handleInputSubmit}></TextField>
        <p bind:this={errorLabel}> </p>
</div>
