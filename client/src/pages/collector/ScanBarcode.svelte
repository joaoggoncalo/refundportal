<script>
    import {onMount} from 'svelte';
    import {patchData, timeOut} from "../../lib/util.js";
    import {token, user} from "../../store.js";
    import {Html5QrcodeScanner} from "html5-qrcode";
    import page from "page";

    let rmaNumber;

    function handleScanSuccess(decodedText, decodedResult) {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        rmaNumber = JSON.parse(decodedText).id;
        fetchRmaNumber();
    }

    function handleScanFailure(error) {
        if (error.name === 'NotReadableError') {
            console.error('Could not start video source. Check camera permissions and availability.');
        }
    }

    async function fetchRmaNumber() {
        try {
            const response = await fetch(`http://localhost:3000/returns/${rmaNumber}`);

            if (response.ok) {
                try {
                    const result = await response.json();
                    if (result.status === 'in transit') {
                        patchRma(result);

                        localStorage.setItem('rmaNumber', JSON.stringify(rmaNumber));
                        let goBack = false;
                        localStorage.setItem('wentBack', JSON.stringify(goBack));
                        page.redirect('./review');
                    } else {
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
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            {fps: 10, qrbox: {width: 250, height: 250}},
            /* verbose= */ false
        );
        html5QrcodeScanner.render(handleScanSuccess, handleScanFailure);

        timeOut();

        return () => html5QrcodeScanner.clear();
    });
</script>
<div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
        <h1 class="text-6xl mt-4 mb-4">Welcome!</h1>
        <h2 class="text-4xl mb-1">Scan the RMA QR code to proceed</h2>
        <div class="flex justify-center  mb-10">
            <div id="reader" style="width: 600px; height: 600px;"></div>
        </div>
    </div>
</div>
