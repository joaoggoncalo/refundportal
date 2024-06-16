<script>
    import {createEventDispatcher} from 'svelte'
    import {nameToRole, roleToName, roles} from "../lib/util.js";

    export let name, email, username, userId, role
    const dispatch = createEventDispatcher()
    let form;
    let error;

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    let isModalOpen = false;


    const handleSubmit = () => {
        const isConfirmed = window.confirm('Are you sure you want to confirm the changes?');
        if (isConfirmed) {
            let formData = new FormData(form);
            let json = {};
            formData.forEach((value, key) => {
                json[key] = value;
                console.log(key + ":" + value)
            });

            json = {...json, role: role}

            sendUserDataToBackend(json)
        }
    }

    async function sendUserDataToBackend(json) {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            });

            if (response.ok) {
                console.log('user successfully sent to the backend');
                dispatch('submit', json);
                toggleModal()
            } else {
                console.error('Failed to send user to the backend');
                const body = await response.json();
                error = body.error
            }
        } catch (error) {
            console.error('Error sending user to the backend:', error);
        }
    }


</script>


<!-- Modal toggle -->
<button data-modal-target="authentication-modal" data-modal-show="authentication-modal"
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button" on:click={toggleModal}>
    Edit user
</button>


{#if isModalOpen}
    <div id="authentication-modal" tabindex="-1" aria-hidden="true"
         class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Change {name} details
                    </h3>

                    <button type="button"
                            class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="authentication-modal"
                            on:click={toggleModal}>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-4 md:p-5">
                    <form bind:this={form} on:submit|preventDefault={handleSubmit} class="space-y-4">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input bind:value={email} type="email" name="email" id="email"
                                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   placeholder="name@company.com" required>
                        </div>
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Username</label>
                            <input bind:value={username} type="text" name="username" id="username" placeholder=" "
                                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   required>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <div class="relative z-0 w-full mb-5 group">
                                <p>Role:</p>
                                <select bind:value={role} name="role" id="role"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        style="line-height: 1.5;">
                                    <option value={role} disabled selected class="hidden">{roleToName[role]}</option>
                                    {#each roles as role}
                                        <option value={nameToRole[role]}>{role}</option>
                                    {/each}
                                </select>
                            </div>

                        </div>
                        <button type="submit"
                                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Confirm edits
                        </button>
                        {#if error}
                            <p class="text-red-600">{error}</p>
                        {/if}
                    </form>
                </div>
            </div>
        </div>
    </div>
{/if}