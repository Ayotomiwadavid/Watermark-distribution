<template>
    <main>
        <nav class="bg-white/70 backdrop-blur-md border-b border-gray-100">
            <div class="max-w-6xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <NuxtLink to="/dashboard" class="flex items-center">
                        <Icon icon="material-symbols:water-drop-outline-rounded" width="1.5em" height="1.5em"
                            class="text-blue-600" />
                        <span class="text-xl font-medium uppercase font-bold"> <span
                                class="text-blue-700">You</span>Guard</span>
                    </NuxtLink>
                    <div class="flex text-center items-center space-x-8">

                        <NuxtLink to="/new" class="flex flex-col items-center space-y-1 mx-auto ml-4">
                            <Icon class="text-center" icon="proicons:pencil" width="1.5em" height="1.5em" />
                            <span class="text-xs font-semibold text-center hidden sm:block">Editor</span>
                        </NuxtLink>

                        <!-- Notification Icon -->
                        <button @click="toggleModal" class="relative flex flex-col items-center space-y-1">
                            <Icon icon="stash:bell" width="1.5em" height="1.5em" />
                            <span class="text-xs font-semibold text-center hidden sm:block">Notification</span>
                        </button>

                        <NuxtLink to="/account" class="flex flex-col items-center space-y-1 ml-4">
                            <Icon icon="solar:settings-linear" width="1.5em" height="1.5em" />
                            <span class="text-xs font-semibold text-center hidden sm:block">Account</span>
                        </NuxtLink>


                        <button @click="logout" class="text-gray-600 hover:text-gray-900 flex items-center ">
                            <Icon icon="mdi:logout" class="h-[1.5em] w-[1.5em]" />
                           
                        </button>
                    </div>
                </div>
            </div>
        </nav>


        <!-- Notification Modal -->
        <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg p-2 max-w-lg w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Notifications</h3>
                    <button @click="toggleModal" class="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                            <g fill="none" fill-rule="evenodd">
                                <path
                                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path fill="#000"
                                    d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z" />
                            </g>
                        </svg>
                    </button>
                </div>

                <Notifications />
            </div>
        </div>
    </main>
</template>

<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';
import axios from 'axios';
import Notifications from '~/pages/notifications.vue';

const isModalVisible = ref(false);
const notifications = ref([]);


const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
};

const fetchAllNotifications = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axios.get('https://watermark-distribution.onrender.com/api/notifications', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        notifications.value = response.data.notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

const logout = () => {
    try {
        // Remove the access token and any other stored user data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");

        // Optionally clear sessionStorage if used
        sessionStorage.clear();

        // Redirect the user to the login page or any desired route
        navigateTo('/signin')
        console.log("User has been logged out successfully.");
    } catch (error) {
        console.error("An error occurred during logout:", error);
    }
};


onMounted(fetchAllNotifications)
</script>

<style></style>