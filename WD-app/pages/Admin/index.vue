<!-- pages/admin/index.vue -->
<template>
    <NuxtLayout name="admindashboard">
        <div class="min-h-screen bg-gray-50">
            <!-- Top Navigation -->


            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div v-for="stat in stats" :key="stat.title"
                        class="flex items-center gap-4 bg-white rounded-lg shadow p-6">
                        <Icon :icon="stat.icon" class="p-2 rounded w-12 h-12" :class="stat.iconStyle" />
                        <div class="">
                            <h3 class="text-sm font-medium text-gray-500">{{ stat.title }}</h3>
                            <div class="mt-1 flex items-baseline">
                                <p class="text-2xl font-semibold">{{ stat.value }}</p>
                                <span :class="`ml-2 text-sm ${stat.status === 'increase' ? 'text-green-500' : 'text-red-500'
                                    }`">
                                    {{ stat.change }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Current Announcement -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-lg font-medium">Current Announcement</h2>
                                <button class="text-sm text-blue-500 hover:text-blue-600" @click="toggleEdit">
                                    {{ isEditing ? 'Save' : 'Edit' }}
                                </button>
                            </div>
                            <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                                <input type="text"
                                    class="w-full bg-gray-100 rounded-lg p-2 text-gray-600 focus:bg-white focus:outline-none"
                                    :disabled="!isEditing" v-model="announcementTitle" placeholder="Enter title" />
                                <textarea
                                    class="w-full bg-gray-100 rounded-lg p-2 text-gray-600 resize-none focus:bg-white focus:outline-none"
                                    :disabled="!isEditing" v-model="announcementContent" rows="4"
                                    placeholder="Enter announcement content"></textarea>
                            </div>
                        </div>
                    </div>
                    <!-- Regional Distribution -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6">
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-medium mb-4">Regional Distribution</h2>
                            </div>
                            <div class="space-y-4" v-if="regions && regions.length > 0">
                                <div v-for="region in regions" :key="region.name" class="flex items-center">
                                    <Icon icon="mynaui:globe" width="1.2em" height="1.2em" class="text-gray-500" />
                                    <span class="w-24 text-sm text-gray-500">{{ region.name }}</span>
                                    <div class="flex-1 mx-2">
                                        <div class="h-2 bg-blue-100 rounded-full">
                                            <div class="h-2 bg-blue-500 rounded-full"
                                                :style="`width: ${(region.users / maxUsers) * 100}%`"></div>
                                        </div>
                                    </div>
                                    <span class="text-sm font-medium">{{ region.users }}</span>
                                </div>
                            </div>

                            <div v-else class="flex justify-center items-center h-48">
                                <p class="text-gray-500 text-sm">No data to show</p>
                            </div>
                        </div>
                    </div>



                    <!-- Regionals -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6">
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-medium mb-4">All Regions ({{ allRegions.length }})</h2>
                                <button @click="openCreateRegionModal"
                                    class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600">
                                    Create Region
                                </button>
                            </div>
                            <div class="space-y-4 mt-4 overflow-auto h-[30vh]">
                                <div v-for="region in allRegions" :key="region.region" class=" flex justify-between items-center mt-2 gap-1">
                                    <div class="flex flex-shrink-0 items-center gap-1">
                                        <Icon icon="mynaui:globe" width="1.2em" height="1.2em" class="text-gray-500" />
                                        <span class="w-24 text-sm flex-shrink-0 whitespace-nowrap text-gray-500">{{ region.region }}</span>
                                    </div>
                                    <button @click="confirmDeleteRegion(region._id)"
                                        class="text-red-500 hover:text-red-700">
                                        <Icon icon="weui:delete-outlined" width="1.2em" height="1.2em" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Confirmation Modal -->
                    <div v-if="showDeleteModal"
                        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 class="text-lg font-medium mb-4">Confirm Delete</h3>
                            <p class="mb-4">Are you sure you want to delete this region?</p>
                            <div class="flex items-center justify-end space-x-2">
                                <button @click="closeDeleteRegionModal" type="button"
                                    class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-400">
                                    Cancel
                                </button>
                                <button @click="deleteRegion" type="button"
                                    class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600">
                                    {{ !isDeleting ? 'Delete' : 'Deleting...' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Create Region Modal -->
                    <div v-if="showModal"
                        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 class="text-lg font-medium mb-4">Create Region</h3>
                            <form @submit.prevent="createRegion">
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700">Region Name</label>
                                    <input v-model="newRegionName" type="text"
                                        class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                                        placeholder="Enter region name" required />
                                </div>
                                <div class="flex items-center justify-end space-x-2">
                                    <button @click="closeCreateRegionModal" type="button"
                                        class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-400">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600">
                                        {{ !isLoading ? 'Create' : 'creating...' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


                <div class="mt-10">
                    <UserTable />
                </div>
            </div>
        </div>
    </NuxtLayout>

</template>

<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';


definePageMeta({
    middleware: 'auth',
});

const isLoading = ref(false)
const isDeleting = ref(false)
// Reactive stats
const stats = ref([
    { title: 'Total Users', value: '0', change: 'N/A', status: '', icon: 'lucide:users', iconStyle: 'bg-blue-200 text-blue-600' },
    { title: 'Pending Approvals', value: '0', change: 'N/A', status: '', icon: 'mdi:account-pending-outline', iconStyle: 'bg-yellow-200 text-yellow-600' },
    { title: 'Active Members', value: '0', change: 'N/A', status: '', icon: 'fluent-mdl2:join-online-meeting', iconStyle: 'bg-green-200 text-green-600' },
    { title: 'Downloads', value: '0', change: '+8%', status: 'increase', icon: 'mingcute:download-3-line', iconStyle: 'bg-purple-200 text-purple-600' }, // Assuming static for now
]);

// Regions data (dynamically updated based on users data)
const regions = ref([]);

// Reactive state for title and content
const announcementTitle = ref('Important Update');
const announcementContent = ref(
    'Latest software update v2.1.0 is now available. All users must update their applications by the end of this month.'
);

// State to track edit mode
const isEditing = ref(false);
const showModal = ref(false)
const newRegionName = ref('')

// Toggle editing mode
const toggleEdit = async () => {
    if (isEditing.value) {
        await saveAnnouncement();
    }
    isEditing.value = !isEditing.value;
};

const openCreateRegionModal = () => {
    showModal.value = true;
}
const closeCreateRegionModal = () => {
    showModal.value = false;
    newRegionName.value = "";
}
const createRegion = async () => {
    isLoading.value = true
    const input = newRegionName.value.trim();
    const token = localStorage.getItem("accessToken")
    try {
        const response = await axios.post('https://watermark-distribution.onrender.com/api/regions/new',
            {
                region: input
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        isLoading.value = false
        console.log("REgion created", response.data)
        toast.success("Region Created")
        closeCreateRegionModal()
            fetchAllRegions()
    }

    catch (err) {
        toast.error(err.message)
        console.error("Error creating region", err)
        isLoading.value = false
    }
}

const allRegions = ref([])
const fetchAllRegions = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axios.get('https://watermark-distribution.onrender.com/api/regions',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        allRegions.value = response.data.regions
        console.log("All reg", allRegions.value);

    } catch (error) {
        console.error("Error fetching all regions", error)
    }
}

// Save the updated announcement
const saveAnnouncement = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const requestBody = {
            title: announcementTitle.value,
            content: announcementContent.value,
        };
        const response = await axios.post(
            'https://watermark-distribution.onrender.com/api/notifications/new',
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success('Announcement updated successfully!');
        console.log(response.data);
    } catch (error) {
        console.error('Error saving announcement:', error);
        toast.error('Failed to update announcement.');
    }
};

const maxUsers = computed(() => {
    return Math.max(...regions.value.map(region => region.users || 0));
});

// Function to fetch region names
const fetchRegionNames = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
            'https://watermark-distribution.onrender.com/api/regions',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const regionData = response.data.regions;
        console.log("Regions", regionData)
        // Assuming the response contains an array of regions
        const regionMap = {};
        regionData.forEach(region => {
            regionMap[region._id] = region.region;
        });
        return regionMap;
    } catch (error) {
        console.error('Error fetching region names:', error);
        return {};
    }
};

const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
            'https://watermark-distribution.onrender.com/api/users',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const users = response.data.users; // Assuming the response contains an array of users
        console.log(users);

        // Fetch region names
        const regionMap = await fetchRegionNames();

        // Calculate stats
        const totalUsers = users.length;
        const pendingApprovals = users.filter(user => !user.approved).length;
        const activeMembers = users.filter(user => user.approved).length;

        // Update stats
        stats.value[0].value = totalUsers.toString();
        stats.value[1].value = pendingApprovals.toString();
        stats.value[2].value = activeMembers.toString();

        // Calculate regions
        const regionCounts = {};
        users.forEach(user => {
            if (user.region) {
                const regionName = regionMap[user.region] || 'Unknown Region';
                if (!regionCounts[regionName]) {
                    regionCounts[regionName] = 0;
                }
                regionCounts[regionName] += 1;
            }
        });

        // Update regions array
        regions.value = Object.entries(regionCounts).map(([name, userCount]) => ({
            name,
            users: userCount,
        }));

        // Example of dynamic stats changes (optional)
        stats.value[1].change = pendingApprovals > 50 ? '+5%' : '-2%';
        stats.value[1].status = pendingApprovals > 50 ? 'increase' : 'decrease';
        stats.value[2].change = activeMembers > 1000 ? '+10%' : '-5%';
        stats.value[2].status = activeMembers > 1000 ? 'increase' : 'decrease';
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};





const showDeleteModal = ref(false);
const regionToDelete = ref(null);

const openDeleteRegionModal = (regionId) => {
    regionToDelete.value = regionId;
    showDeleteModal.value = true;
};

const closeDeleteRegionModal = () => {
    showDeleteModal.value = false;
    regionToDelete.value = null;
};

const deleteRegion = async () => {
    isDeleting.value = true
    const token = localStorage.getItem('accessToken');
    try {
        await axios.delete(`https://watermark-distribution.onrender.com/api/regions/${regionToDelete.value}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        isDeleting.value = false
        toast.success('Region deleted successfully!');
        closeDeleteRegionModal();
        fetchAllRegions(); 

    } catch (error) {
        console.error('Error deleting region:', error);
        toast.error('Failed to delete region.');
        isDeleting.value = false
    }
};

const confirmDeleteRegion = (regionId) => {
    openDeleteRegionModal(regionId);
};


// Fetch data on component mount
onMounted(fetchUsers);
onMounted(fetchAllRegions)
</script>
