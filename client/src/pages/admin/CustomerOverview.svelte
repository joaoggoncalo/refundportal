<script>
    import {onMount} from 'svelte';
    import TableWorkers from "../../components/TableWorkers.svelte";
    import SideNavigator from "./dashboard/SideNavigator.svelte";
    import Searchbar from "../../components/Searchbar.svelte";
    import EditUserModal from "../../components/EditUserModal.svelte";

    let customers = [];
    let filteredUsersByUsername = [];
    let searchText = "";
    const roleId = 2; //customer

    let showModal = false
    let isDataLoaded = false;
    let isSidebarVisible = true;
    const handleToggleModal = () => {
        showModal = !showModal
    }

    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
    }

    let fetchDetails = fetchAllCustomers();

    async function fetchAllCustomers() {
        try {
            const response = await fetch(`http://localhost:3000/users/role/customers`, {
                method: 'GET',
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result)
                customers = result.customers;
                return result
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching all customers', error);
            throw new Error('Error fetching customers');
        }
    }


    const filterUsersByUsername = () => {
        filteredUsersByUsername = customers.filter(user => {
            let users = user.username.toLowerCase()
            return users.includes(searchText.toLocaleLowerCase())
        });
    }


</script>

{#await fetchDetails}
{:then result}
    <Searchbar bind:searchText on:input={filterUsersByUsername}></Searchbar>
    <SideNavigator {isSidebarVisible} {toggleSidebar}/>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Username
                </th>
                <th scope="col" class="px-6 py-3">
                    <div class="flex items-center">
                        email

                        <svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                        </svg>

                    </div>
                </th>
                <th scope="col" class="px-6 py-3">
                    <div class="flex items-center">
                        Role

                        <svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>

                    </div>
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
            </thead>
            <tbody>
            {#if searchText.length === 0}
                {#each result.customers as customer}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {customer.username}
                        </th>
                        <td class="px-6 py-4">
                            {customer.email}
                        </td>
                        <td class="px-6 py-4">
                            {customer.role}
                        </td>
                        <td class="px-6 py-4 text-right">
                            <EditUserModal on:submit={()=>fetchDetails =fetchAllCustomers()} name="customer"
                                           username={customer.username} email={customer.email}
                                           userId={customer.userId} role={customer.role}></EditUserModal>
                        </td>
                    </tr>
                {/each}
            {:else}
                {#each filteredUsersByUsername as customer}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {customer.username}
                        </th>
                        <td class="px-6 py-4">
                            {customer.email}
                        </td>
                        <td class="px-6 py-4">
                            {customer.role}
                        </td>
                        <td class="px-6 py-4 text-right">
                            <EditUserModal on:submit={()=>fetchDetails =fetchAllCustomers()} name="customer"
                                           username={customer.username} email={customer.email}
                                           userId={customer.userId} role={customer.role}></EditUserModal>
                        </td>
                    </tr>
                {/each}
            {/if}

            </tbody>
        </table>
    </div>

{/await}
