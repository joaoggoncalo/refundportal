<script>
    import SideNavigator from "./dashboard/SideNavigator.svelte";
    import Form from "../../components/Form.svelte";
    import Input from "../../components/Input.svelte";
    import {postData} from "../../lib/util.js";
    import {token} from "../../store.js";
    import InfoModal from "../../components/InfoModal.svelte";

    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
    }

    let isSidebarVisible = true;
    let disableSubmit = false;
    let submitted = false;

    const handleSubmit = async (event) => {
        disableSubmit = true
        await postData(`http://localhost:3000/users`, $token, event.detail)
        submitted = true;
    }

    const closeModal = () => {
        disableSubmit = false;
        submitted = true;
    }

</script>

<SideNavigator {isSidebarVisible} {toggleSidebar}/>

{#if submitted}
    <InfoModal on:modalClose={closeModal} header="User created!" info="A new user have been added to the system"/>
{/if}

<section class="flex justify-center pt-10">
    <Form on:submit={handleSubmit}
          formClass="flex flex-col w-5/12 p-5 border-[1px] border-black rounded-2xl"
          buttonClass="bg-gray-300 px-2 py-1 rounded"
          buttonText="Create"
          disableSubmit={disableSubmit}
    >
        <Input labelText="Username"
               inputClassName="p-1 outline-none border-[1px] border-black rounded mb-2"
               labelClassName=""
               placeholder="John Doe"
               inputType="text"
               inputName="username"/>
        <Input labelText="Password"
               inputClassName="p-1 outline-none border-[1px] border-black rounded mb-2"
               labelClassName=""
               placeholder="••••••••"
               inputType="password"
               inputName="password"/>
        <Input labelText="Role"
               inputClassName="p-1 outline-none border-[1px] border-black rounded mb-2"
               labelClassName=""
               placeholder="" inputType="dropDown"
               inputName="role"
               options={[
                    {value: 2,label: "Customer"},
                    {value: 4,label: "Collector"},
                    {value: 3,label: "Controller"},
                    {value: 1,label: "Admin"}
               ]}
        />
        <Input labelText="Email"
               inputClassName="p-1 outline-none border-[1px] border-black rounded mb-2"
               labelClassName=""
               placeholder="example@gmail.com"
               inputType="text"
               inputName="email"/>
    </Form>
</section>