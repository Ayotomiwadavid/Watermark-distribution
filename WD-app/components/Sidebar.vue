<template>
    <main>
        <div class="md:flex md:w-64 md:flex-col h-screen bg-white shadow z-99 md:h-auto">
            <div class="flex flex-col flex-grow pt-5 overflow-y-auto h-full z-99 bg-white">
                <div class="flex  items-center md:flex-shrink-0 px-4">
                    <Icon icon="material-symbols:water-drop-outline-rounded" width="1.5em" height="1.5em"
                        class="text-blue-600" />

                    <NuxtLink to="/admin" class="text-xl font-medium uppercase font-bold">
                        <span class="text-blue-700">You</span>Guard
                    </NuxtLink>
                </div>


                <div class="hidden md:flex px-4 mt-16 md:mt-6">
                    <hr class="border-gray-200" />
                </div>

                <div class="flex flex-col flex-1 px-3 mt-8 md:mt-6">
                    <div class="space-y-4">
                        <nav class="flex-1 space-y-2">
                            <a href="/admin" title=""
                                class="flex items-center px-4 py-2.5 text-md font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg group">
                                <svg class="flex-shrink-0 w-5 h-5 mr-4 text-white w-6 h-6"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Dashboard
                            </a>

                            <a href="/admin/messages"
                                class="flex items-center px-4 py-2.5 text-md font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-indigo-600 group">


                                <svg class="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg" width="2"
                                    height="2" viewBox="0 0 24 24">
                                    <g fill="currentColor">
                                        <path
                                            d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-4.586l-2.707 2.707a1 1 0 0 1-1.414 0L8.586 19H4a2 2 0 0 1-2-2zm18 0H4v11h5a1 1 0 0 1 .707.293L12 19.586l2.293-2.293A1 1 0 0 1 15 17h5z" />
                                        <path
                                            d="M13.5 11.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m4 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-8 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
                                    </g>
                                </svg>


                                Messages
                            </a>

                            <a href="/admin/users"
                                class="flex items-center px-4 py-2.5 text-md font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-indigo-600 group">
                                <svg class="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Users
                            </a>

                            <a href="/admin/notifications"
                                class="flex items-center px-4 py-2.5 text-md font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-indigo-600 group">


                                <Icon class="flex-shrink-0 w-5 h-5 mr-4" icon="ant-design:notification-outlined"
                                    width="1.5em" height="1.5em" />
                                Announcements
                            </a>

                            <a href="/admin/software"
                                class="flex items-center px-4 py-2.5 text-md font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-indigo-600 group">
                                <Icon class="flex-shrink-0 w-5 h-5 mr-4" icon="grommet-icons:cloud-software" />
                                Software

                            </a>
                        </nav>


                        <hr class="border-gray-200" />
                    </div>

                    <div class="pb-4 md:mt-[250px]">
                        <button type="button" @click="logout"
                            class="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2">
                                    <path stroke-dasharray="36" stroke-dashoffset="36"
                                        d="M12 4h-7c-0.55 0 -1 0.45 -1 1v14c0 0.55 0.45 1 1 1h7">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s"
                                            values="36;0" />
                                    </path>
                                    <path stroke-dasharray="14" stroke-dashoffset="14" d="M9 12h11.5">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s"
                                            values="14;0" />
                                    </path>
                                    <path stroke-dasharray="6" stroke-dashoffset="6"
                                        d="M20.5 12l-3.5 -3.5M20.5 12l-3.5 3.5">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s"
                                            values="6;0" />
                                    </path>
                                </g>
                            </svg>
                            Logout

                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { Icon } from "@iconify/vue";


const logout = () => {
    try {
        // Remove the access token and any other stored user data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");

        // Optionally clear sessionStorage if used
        sessionStorage.clear();

        // Redirect the user to the login page or any desired route
        navigateTo('/admin/signin')
        console.log("User has been logged out successfully.");
    } catch (error) {
        console.error("An error occurred during logout:", error);
    }
};
</script>

<style></style>