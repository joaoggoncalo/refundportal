<script>
    import {token, user} from "../store.js"
    import {logOut} from "../lib/util.js";
    import {roleToName} from "../lib/util.js";

    let isMenuOpen = false;


    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
    };

</script>

<header class="no-print">
    <nav class="bg-gray-200 border-gray-200 px-4 md:px-6">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

            <div class="flex items-center justify-between">
                <p class="rounded font-bold mr-3">{roleToName[$user.role].toUpperCase()}</p>

                <a href="#" class="flex items-center bg-gray-100 border-2 p-3.5 my-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                    </svg>
                </a>

                <p class="ml-2"> {$user.email}  </p>
            </div>

            <div class="flex items-center md:order-2">
                {#if !$token}
                    <a href="/login"
                       class="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-4 md:px-5 py-2 md:py-2.5 mr-2  focus:outline-none ">
                        Log in
                    </a>
                {:else}
                    <button on:click={() => logOut()}>
                        <a href="/login"
                           class="my-4 text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-4 md:px-5 py-2 md:py-2.5 mr-2  focus:outline-none ">
                            Log out
                        </a>
                    </button>
                {/if}

                <button data-collapse-toggle="mobile-menu-2" type="button"
                        class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="mobile-menu-2" aria-expanded="false"
                        on:click={toggleMenu}>
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clip-rule="evenodd"></path>
                    </svg>
                    <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <div class="{(isMenuOpen ? 'flex' : 'hidden')} justify-between items-center w-full md:flex md:w-auto md:order-1"
                 id="mobile-menu-2">
                <ul class="flex flex-row mt-4 font-medium md:space-x-8 md:mt-0 bg-gray-100 self-start md:bg-gray-200 w-full md:w-auto justify-evenly">
                    <slot/>
                </ul>
            </div>
        </div>
    </nav>
</header>
