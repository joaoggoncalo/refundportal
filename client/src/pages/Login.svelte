<script>
    import page from 'page';
    import {user, token} from '../store.js';

    let username = '';
    let password = '';
    let loginError = '';

    async function handleLoginSubmit() {
        if (!username || !password) {
            loginError = 'Please provide both username and password';
            return;
        }
        try {
            const userData = {
                username: username,
                password: password
            };
            const response = await fetch('http://localhost:3000/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const {accessToken, userObject} = await response.json();
                token.set(accessToken); // This updates the token store
                user.set(userObject); // This updates the user store
            } else {
                const data = await response.json();
                loginError = `Login failed: ${data.message}`;
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError = 'An error occurred during login';
        }
    }

    $: {
        console.log('User role is:', $user.role);
        if ($user && $user.role) {
            switch ($user.role) {
                case 1:
                    page.redirect('/admin');
                    break;
                case 2:
                    page.redirect(`/customer/${$user.id}/orders`);
                    break;
                case 3:
                    page.redirect('/controller');
                    break;
                case 4:
                    page.redirect('/collector/scan');
                    break;
                default:
                    loginError = 'Unauthorized access';
                    break;
            }
        }
    }
</script>


<section class="bg-gray-50 animated-background">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
             style="cursor:pointer;">
            <img class="custom-logo mr-2"
                 src="https://myshop.s3-external-3.amazonaws.com/shop6116500.images.logo-myshop.webp" alt="logo">
            MyShop
        </div>
        <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  ">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Sign in to your account
                </h1>
                <form class="space-y-4 md:space-y-6" on:submit|preventDefault={handleLoginSubmit}>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                            username</label>
                        <input bind:value={username} type="text" name="username" id="username"
                               class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5      "
                               placeholder="username" required="">
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                        <input bind:value={password} type="password" name="password" id="password"
                               placeholder="••••••••"
                               class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5      "
                               required="">
                    </div>
                    {#if loginError}
                        <p class="text-red-500">Invalid email or password</p>
                    {/if}
                    <a href="/forgot"
                       class="text-sm font-medium text-primary-600 hover:underline ">Forgot
                        password?</a>
                    <button type="submit"
                            class="w-full text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   ">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    </div>

</section>

<style>
    .custom-logo {
        width: 40px;
        height: auto;
    }

    @media (min-width: 768px) {
        .custom-logo {
            width: 60px; /* Larger size on wider screens */
        }
    }


    button:hover {
        background-color: #941017;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
        transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
    }


</style>