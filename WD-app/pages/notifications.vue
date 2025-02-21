<template>
        <div class="h-[70vh] overflow-y-scroll bg-gray-50 p-6">
            <!-- Header -->
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">All</h1>
                    <div class="flex gap-3">
                        <button @click="clearAllNotifications"
                            class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            Clear all
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="mt-4 flex gap-4">
                    <select v-model="timeFilter"
                        class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>

            <!-- Notifications List -->
            <div class="space-y-4">
                <!-- Today Section -->
                <div v-if="todayNotifications.length > 0">
                    <h2 class="text-sm font-medium text-gray-500 mb-3">Today</h2>
                    <div class="space-y-2">
                        <div v-for="notification in todayNotifications" :key="notification.id" class="p-4 bg-white rounded-lg shadow-sm border transition-all">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">{{ notification.title }}</p>
                                    <p class="text-gray-600 mt-1">{{ notification.content }}</p>
                                    <span class="text-sm text-gray-500 mt-2 block">{{ formatTime(notification.createdAt) }}</span>
                                </div>
                                <!-- <button @click="deleteNotification(notification.id)"
                                    class="text-gray-400 hover:text-red-500">
                                    <span class="sr-only">Delete</span>
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button> -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Earlier Section -->
                <div v-if="earlierNotifications.length > 0">
                    <h2 class="text-sm font-medium text-gray-500 mb-3">Earlier</h2>
                    <div class="space-y-2">
                        <div v-for="notification in earlierNotifications" :key="notification.id" class="p-4 bg-white rounded-lg shadow-sm border transition-all">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">{{ notification.title }}</p>
                                    <p class="text-gray-600 mt-1">{{ notification.content }}</p>
                                    <span class="text-sm text-gray-500 mt-2 block">{{ formatDate(notification.createdAt) }}</span>
                                </div>
                                <button @click="deleteNotification(notification.id)"
                                    class="text-gray-400 hover:text-red-500">
                                    <span class="sr-only">Delete</span>
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="!todayNotifications.length && !earlierNotifications.length" class="text-center py-12">
                    <p class="text-gray-500">No notifications found</p>
                </div>
            </div>
        </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';

const timeFilter = ref('all');
const notifications = ref([]);

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

const filteredNotifications = computed(() => {
    let filtered = [...notifications.value];
    const now = new Date();

    if (timeFilter.value === 'today') {
        filtered = filtered.filter((n) => isToday(n.createdAt));
    } else if (timeFilter.value === 'week') {
        filtered = filtered.filter((n) => isThisWeek(n.createdAt));
    } else if (timeFilter.value === 'month') {
        filtered = filtered.filter((n) => isThisMonth(n.createdAt));
    }

    return filtered;
});

const todayNotifications = computed(() => filteredNotifications.value.filter((n) => isToday(n.createdAt)));
const earlierNotifications = computed(() => filteredNotifications.value.filter((n) => !isToday(n.createdAt)));

const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();
const isThisWeek = (date) => new Date(date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const isThisMonth = (date) => {
    const now = new Date();
    const target = new Date(date);
    return target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear();
};

const formatTime = (date) => new Date(date).toLocaleTimeString();
const formatDate = (date) => new Date(date).toLocaleDateString();

const deleteNotification = async (id) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
};

const clearAllNotifications = async () => {
    notifications.value = [];
};

onMounted(fetchAllNotifications);
</script>
