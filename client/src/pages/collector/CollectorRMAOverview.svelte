<script>
    import {changeRmaStatus, patchData, timeOut} from "../../lib/util.js";
    import {token} from "../../store.js";
    import page from "page";
    import {onMount} from "svelte";

    let rmaItems = JSON.parse(localStorage.getItem('rmaItems'));
    let rmaNumber;
    let notAllChangesCaught;
    let transit = false;

    function generateElementsFromDatabase() {
        let counter = 0;
        const container = document.querySelector('.items');
        rmaItems.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('bg-blue-200', 'p-4', 'm-2', 'flex-1');
            div.textContent = item.name + ': ' +
                (rmaItems[counter].productStatus ? rmaItems[counter].productStatus : 'Did not submit anything') +
                (rmaItems[counter].damageDescription ? ', Damage description: ' + rmaItems[counter].damageDescription : '') +
                (rmaItems[counter].damageImage ? ', Damage image: ' + rmaItems[counter].damageImage : '');
            container.appendChild(div);
            counter++;
        });
        notAllChangesCaught = rmaItems.some(item => item.productStatus === null);
    }

    onMount(generateElementsFromDatabase)

    function finishRMAReview() {
        rmaNumber = JSON.parse(localStorage.getItem('rmaNumber'));

        rmaItems.forEach(item => {
            if (item.damageDescription === '') {
                item.damageDescription = 'No comment'
            }
            const payload = {
                rmaId: rmaNumber,
                productId: item.productId,
                productStatus: item.productStatus,
                processStatus: item.processStatus,
                damageDescription: item.damageDescription,
                damageImage: null
            };

            patchData(`http://localhost:3000/return-items/${item.id}`, $token, payload);
        });

        changeRmaStatusAtTheEnd();

    }

    async function changeRmaStatusAtTheEnd() {
        if (transit) {
            await changeRmaStatus('in transit', rmaNumber, $token);
        } else {
            await changeRmaStatus('received', rmaNumber, $token);
        }
        page.redirect("../collector/scan")
    }


    async function handleTransitButton() {
        transit = true;
        finishRMAReview();
    }

    function goBack() {
        let goBack = true;
        localStorage.setItem('wentBack', JSON.stringify(goBack));
        page.redirect("../collector/review")
    }

    //Log out user if inactive for 2 hours
    timeOut();
</script>

<div class="items flex-row justify-center m-5"></div>
<div class="flex justify-center">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={goBack}>
        Go back
    </button>


    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
            on:click={handleTransitButton}>
        Transit
    </button>


    {#if notAllChangesCaught}
        <div class="flex justify-center ml-10">
            <p> You cannot submit because you did not mark all the items</p>
        </div>
    {:else}

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
                on:click={finishRMAReview}>
            Submit
        </button>
    {/if}
</div>