<script>
    import Button from "../../components/Button.svelte";
    import {token} from "../../store.js"
    import {fetchData} from "../../lib/util.js";

    export let params;

    let rmaPromise = fetchData(`http://localhost:3000/returns/${params.rmaId}`, $token);
    let qrPromise = fetchData(`http://localhost:3000/returns/${params.rmaId}/qr-code`, $token);

</script>

<section class="flex align-middle justify-center">
    {#await rmaPromise}
        Loading...
    {:then rma}
        <div class="label-wrap flex flex-col bg-white border shadow-sm rounded-xl w-10/12 md:w-6/12 mt-5 md:mt-20">
            <div class="no-print bg-gray-800/[.1] border border-gray-200 text-base md:text-2xl xl:text-4xl text-gray-800 p-4">
                <span class="font-bold">Success</span>
            </div>
            <div class="p-4 md:p-5">
                <div class="flex flex-col sm:flex-row justify-between mb-7">
                    <div class="flex flex-col">
                        <h3 class="no-print text-base md:text-2xl xl:text-4xl font-bold text-gray-800">
                            New refund request was created!
                        </h3>
                        <div class="flex flex-col justify-evenly text-gray-400">
                            <span class="no-print font-bold">Your refund ID is {rma.rmaId}</span>
                            <div class="flex flex-col justify-evenly mt-10 text-base md:text-2xl xl:text-4xl">
                                <span class="print text-gray-700">Refund ID: {rma.rmaId}</span>
                                <span class="print text-gray-700">Order ID: {rma.orderId}</span>
                                <span class="print text-gray-700">Created on: {rma.createdDate}</span>
                            </div>
                        </div>
                        <span class="mt-auto mb-3">
                            *Please, stick this qr code to your return package or put this paper inside.
                        </span>
                    </div>
                    <div class="flex flex-row justify-center align-middle self-center">

                        {#await qrPromise}
                            Loading...
                        {:then qrCode}
                            <img class="object-contain" src="{qrCode}" alt={`QRCode:${rma.rmaId}`}>
                        {/await}
                    </div>
                </div>
                <div class="print grid items-grid text-center align-middle border-[1px] border-black mb-5">
                    <span class="border-[1px] border-black">Item</span>
                    <span class="border-[1px] border-black">Reason</span>
                    <span class="border-[1px] border-black">Price</span>
                    {#each rma.items as item}
                        <div class="border-[1px] border-black">{item.name}</div>
                        <div class="border-[1px] border-black">{item.damageDescription}</div>
                        <div class="border-[1px] border-black">{item.price}</div>
                    {/each}
                </div>
                <div class="flex flex-row justify-evenly">
                    <a class="no-print text-base text-center bg-slate-500 rounded-2xl p-1.5 text-slate-100 w-1/3 self-center mb-2"
                       href="../">
                        Back
                    </a>
                    <Button className="no-print w-1/3 self-center" text="Download"
                            on:click={() => {window.print()}}/>
                </div>
            </div>
        </div>
    {/await}
</section>

<style>
    .print {
        display: none;
    }

    @media print {
        .no-print {
            display: none !important;
        }

        .print {
            display: block !important;
        }

        .label-wrap {
            width: 100% !important;
            padding: 0 !important;
            margin-top: 0 !important;
        }

        .items-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            border-collapse: collapse !important;
        }
    }

    .items-grid {
        grid-template-columns: repeat(3, 1fr);
    }

</style>