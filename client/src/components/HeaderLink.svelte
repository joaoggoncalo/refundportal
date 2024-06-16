<script>
    export let href, text, className = "";
</script>

<li class="py-4 px-2 hover:bg-gray-300 border-b-2 border-b-gray-500">
    <a href="{href}"
       class="block py-2 pr-4 pl-3 text-black rounded lg:bg-transparent lg:text-black lg:p-0 {className}"
       aria-current="page">
        {text}
    </a>
</li>