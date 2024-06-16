<script>
    import router from 'page';
    import page from "page";
    import Header from "./components/Header.svelte";
    import HeaderLink from "./components/HeaderLink.svelte";
    import Login from "./pages/Login.svelte";

    import ScanBarcode from "./pages/collector/ScanBarcode.svelte";
    import ReviewItemsCondition from "./pages/collector/ReviewItemsCondition.svelte";
    import CollectorRMAOverview from "./pages/collector/CollectorRMAOverview.svelte";
    import CustomerOrdersList from "./pages/customer/CustomerOrdersList.svelte";
    import CustomerOrderDetails from "./pages/customer/CustomerCreateRMA.svelte";
    import CustomerRMAList from "./pages/customer/CustomerRMAList.svelte";
    import Controller from "./pages/controller/Controller.svelte";
    import ForgotPassword from "./pages/ForgotPassword.svelte";
    import CustomerCreationSuccessful from "./pages/customer/CustomerCreationSuccessful.svelte";
    import ControllerOverview from "./pages/admin/EmployeeOverview.svelte";
    import ReturnsOverview from "./pages/admin/ReturnsOverview.svelte";
    import RefundDetails from "./pages/admin/RefundDetails.svelte";
    import Dashboard from "./pages/admin/dashboard/Dashboard.svelte"
    import CustomerOverview from "./pages/admin/CustomerOverview.svelte";
    import CreateUser from "./pages/admin/CreateUser.svelte";

    import Unauthorised from "./pages/Unauthorised.svelte";
    import ManualSelectRma from "./pages/collector/ManualSelectRma.svelte";
    import {user} from "./store.js"

    let currentPage;
    let params;
    let currentRoute = window.location.pathname;

    function checkRouteAuthorization(userRole, route) {
        // Define role-based access to routes here
        const routeAccess = {
            '/admin': [1],
            '/customer': [2],
            '/controller': [3],
            '/collector': [4],
            // ...
        };

        // Find the key in routeAccess that matches the route segment
        const matchingRoute = Object.keys(routeAccess).find(key => route.includes(key));
        const allowedRoles = matchingRoute ? routeAccess[matchingRoute] : null;

        console.log("Chosen allowed roles: " + allowedRoles);
        console.log("Route access array for my route: " + routeAccess[matchingRoute]);

        return allowedRoles ? allowedRoles.includes(userRole) : false;
    }


    router('/', () => {
        page("/login")
    });

    router('/login', (ctx) => {
        currentPage = Login;
        currentRoute = ctx.pathname;
    });

    router('/forgot', (ctx) => {
        currentPage = ForgotPassword;
        currentRoute = ctx.pathname;
    });

    router('/customer/:id/orders', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = CustomerOrdersList;
            params = ctx.params
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/customer/:id/refunds', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = CustomerRMAList;
            params = ctx.params
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/customer/:customerId/orders/:orderId', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = CustomerOrderDetails;
            params = ctx.params
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/customer/:customerId/orders/:rmaId/success', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = CustomerCreationSuccessful;
            params = ctx.params
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/collector/scan', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = ScanBarcode;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/collector/manual', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = ManualSelectRma;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/collector/review', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = ReviewItemsCondition;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/collector/overview', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = CollectorRMAOverview;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/controller', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = Controller;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/admin/employee', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
        currentPage = ControllerOverview;
        currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });
    router('/admin/customer', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
        currentPage = CustomerOverview;
        currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/admin/returns', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = ReturnsOverview;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/admin/returns/:rmaId', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = RefundDetails;
            params = ctx.params
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/admin/create-user', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = CreateUser;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router('/admin', (ctx) => {
        if (checkRouteAuthorization($user.role, ctx.pathname)) {
            currentPage = Dashboard;
            currentRoute = ctx.pathname;
        } else {
            currentPage = Unauthorised
        }
    });

    router.start();
</script>


<main>
    {#if currentRoute !== "/login"}
        <Header>
            {#if $user !== ""}
                {#if currentRoute.includes("collector")}
                    <HeaderLink href="/collector/scan" text="Scan"/>
                    <HeaderLink href="/collector/manual" text="Manual"/>
                {:else if currentRoute.includes("controller")}
<!--                    <HeaderLink href="/controller" text="Received"/>-->
<!--                    <HeaderLink href="/controller/customers" text="Customer"/>-->
                {:else if currentRoute.includes("customer")}
                    <HeaderLink href={`/customer/${$user.id}/orders`} text="Orders"/>
                    <HeaderLink href={`/customer/${$user.id}/refunds`} text="My Refunds"/>
                {/if}
            {/if}
        </Header>
    {/if}

    <svelte:component this={currentPage} {params}/>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        padding: 0;
        margin: 0 auto;
    }

</style>
