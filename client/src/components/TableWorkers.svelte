<script>
    import EditUserModel from "./EditUserModal.svelte";

    export let listOfUsers, role, open, name

</script>


<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
            <th scope="col" class="px-6 py-3">
                {role}
            </th>
            <th scope="col" class="px-6 py-3">
                status
            </th>
            <th scope="col" class="px-6 py-3">
                current rma
            </th>

            <th scope="col" class="px-6 py-3">

            </th>
        </tr>
        </thead>
        <tbody>
        {#each listOfUsers as employee}
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {employee.username}
                </th>
                <td class="px-6 py-4">
                    {employee.state}
                </td>
                <td class="px-6 py-4">
                    {employee.task}
                </td>

                <td class="px-6 py-4">


                    <EditUserModel name={name} username={employee.username} userId={employee.userId}
                                   email={employee.email}></EditUserModel>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>