<template>
    <main>
        <nav class="bg-white shadow-sm fixed w-full top-0 md:w-[84%]">
            <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-2">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <!-- Mobile Sidebar Toggle Button -->
                        <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-100 md:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <!-- Display Custom Mapped Route Name -->
                        <h1 class="text-xl font-semibold ml-2">Dashboard</h1>
                    </div>
                    <div class="flex items-center space-x-4 mr-4 md:mr-8">
                        <button class="p-2 rounded-full hover:bg-gray-100">
                        </button>
                        <div class="flex items-center space-x-2">
                            <NuxtLink to="/admin/account" class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span class="text-white text-sm">AD</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </main>
</template>

<script>
export default {
    props: {
        toggleSidebar: {
            type: Function
        }
    },
    methods: {
        openSidebar() {
            this.toggleSidebar()
        }
    },
    computed: {
        // Map route names to custom strings
        mappedRouteName() {
            const routeNameMap = {
                Admin: "Dashboard",
                "Admin-Messages": "Messages",
                "Admin-Users": "Users",
                "Admin-Notifications": "Notifications"
            };
            return routeNameMap[this.$route.name] || this.$route.name || "Dashboard";
        }
    }
};
</script>

<style></style>
