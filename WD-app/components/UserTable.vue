<template>
    <main>
        <div class="max-w-8xl mx-auto">
            <!-- Header -->
            <div class="md:flex justify-between items-center mb-6">
                <h1 class="md:text-2xl font-semibold text-gray-900 mb-2 md:mb-0">User Management</h1>
                <div class="md:flex items-center  space-y-2 md:space-y-0 md:space-x-4">
                    <div class="relative">
                        <Icon icon="mdi:magnify"
                            class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" v-model="searchQuery" placeholder="Search users..."
                            class="pl-10  w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64">
                    </div>
                    <select v-model="selectedRegion"
                        class="md:border md:border-gray-300 mt-4 md:mt-0 w-[120px] md:w-auto rounded-lg md:px-4 py-2 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-blue-500">
                        <option value="">All Regions</option>
                        <option v-for="region in regions" :key="region._id" :value="region.region">
                            {{ region.region }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-lg ">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th v-for="header in headers" :key="header.key"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    @click="sortBy(header.key)">
                                    <div class="flex items-center space-x-1">
                                        <span>{{ header.label }}</span>
                                        <Icon v-if="sortColumn === header.key"
                                            :name="sortDirection === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                                            class="h-4 w-4" />
                                    </div>
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <div
                                                class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span class="text-blue-600 font-medium">
                                                    {{ user.name.charAt(0) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                                            <div class="text-sm text-gray-500">{{ user.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">{{ user.nickname }}</span>
                                </td>
                                <!-- <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">{{ user.phone }}</span>
                                </td> -->
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">{{ user.region }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(user.status)}`">
                                        {{ user.status === true ? 'Approved' : 'Pending' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex justify-end space-x-3">
                                        <button @click="toggleApproval(user)" :class="`px-3 py-1 rounded-lg text-xs font-medium ${user.status
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`">

                                            <div>
                                                {{ user.status ? 'Revoke' : 'Approve' }}
                                            </div>
                                        </button>

                                        <!-- <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900">
                                            <Icon icon="mdi:pencil" class="h-5 w-5" />
                                        </button>
                                        <button @click="messageUser(user)" class="text-gray-600 hover:text-gray-900">
                                            <Icon icon="mingcute:message-4-line" width="1.5em" height="1.5em" />
                                        </button> -->
                                        <button @click="openDeleteModal(user)" class="text-red-600 hover:text-red-900">
                                            <Icon icon="mdi:trash-can-outline" class="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div class="flex items-center justify-between">

                        <div class="flex items-center space-x-2">
                            <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`">
                                {{ page }}
                            </button>
                        </div>
                    </div>
                </div>


                <div v-if="showDeleteModal"
                    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 w-96">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h2>
                        <p class="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{{ selectedUser?.name }}</strong>? This action
                            cannot be undone.
                        </p>
                        <div class="flex justify-end space-x-4">
                            <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                @click="closeDeleteModal">
                                Cancel
                            </button>
                            <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                @click="confirmDelete">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { toast } from 'vue3-toastify';

const isToggling = ref(false)

const searchQuery = ref('');
const selectedRegion = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortColumn = ref('name');
const sortDirection = ref('asc');


const showDeleteModal = ref(false);
const selectedUser = ref(null);

// Open the delete confirmation modal
const openDeleteModal = (user) => {
    selectedUser.value = user;
    showDeleteModal.value = true;
};

// Close the delete modal
const closeDeleteModal = () => {
    selectedUser.value = null;
    showDeleteModal.value = false;
};

// Confirm the delete action
const confirmDelete = async () => {
    if (selectedUser.value) {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`https://watermark-distribution.onrender.com/api/users/${selectedUser.value.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`User ${selectedUser.value.name} deleted successfully`);
            // Refresh users list
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
            console.error("Error deleting user:", error);
        } finally {
            closeDeleteModal();
        }
    }
};


const headers = [
    { key: 'name', label: 'Name' },
    { key: 'nickname', label: 'Nickname' },
    // { key: 'phone', label: 'Phone' },
    { key: 'region', label: 'Region' },
    { key: 'status', label: 'Status' },
];

const regions = ref([]);

const users = ref([]);

const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://watermark-distribution.onrender.com/api/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("All users:", response.data.users);

        // Filter and transform the API response to match your requirements
        users.value = response.data.users
            .filter(user => user.role === 'User') // Only include users with role 'user'
            .map(user => ({
                id: user._id,
                name: user.fullName || 'N/A',
                nickname: user.username || 'N/A',
                email: user.email || 'N/A',
                // phone: user.phone || 'N/A', 
                region: regionsMap.value[user.region] || 'Unknown Region',
                status: user.isApproved, // Map 'Approved' to 'status'
            }));
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


const regionsMap = ref({});

const fetchRegions = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://watermark-distribution.onrender.com/api/regions', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        regions.value = response.data.regions
        // Transform regions into a map for easy lookup
        regionsMap.value = response.data.regions.reduce((map, region) => {
            map[region._id] = region.region; // Assuming `id` is the region ID and `name` is the region name
            return map;
        }, {});
    } catch (error) {
        console.error('Error fetching regions:', error);
    }
};


onMounted(fetchUsers);
onMounted(fetchRegions)


// Filter and sort users
const filteredUsers = computed(() => {
    let filtered = [...users.value];

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.nickname.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }

    // Apply region filter
    if (selectedRegion.value) {
        filtered = filtered.filter(user => user.region === selectedRegion.value);
    }

    // Apply sorting
    filtered.sort((a, b) => {
        const aValue = a[sortColumn.value];
        const bValue = b[sortColumn.value];

        if (sortDirection.value === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    return filtered;
});

const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const getStatusClass = (status) => {
    switch (status) {
        case true:
            return 'bg-green-100 text-green-700';
        case false:
            return 'bg-yellow-100 text-yellow-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const sortBy = (column) => {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn.value = column;
        sortDirection.value = 'asc';
    }
};

const toggleApproval = async (user) => {
    console.log(user);
    isToggling.value = user.status
    const id = user.id;
    const currentStatus = user.isApproved
    const token = localStorage.getItem('accessToken');
    try {
        // Toggle approval status
        const updatedStatus = !currentStatus;
        console.log("Sattus", updatedStatus, token)

        const response = await axios.patch(
            `https://watermark-distribution.onrender.com/api/users/${id}/approve`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );

        console.log(response);
        console.log(`User ${id} approval status changed to: ${updatedStatus}`);
        isToggling.value = false
        toast.success("User approved")
        await fetchUsers()
    } catch (error) {
        isToggling.value = false
        toast.error("Approval failed, try again")
        console.error('Error toggling user approval status:', error);
    }
};


// const deleteUser = async (user) => {
//     if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
//         try {
//             const token = localStorage.getItem('accessToken');
//             await axios.delete(`https://watermark-distribution.onrender.com/api/users/${user.id}/approve`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             users.value = users.value.filter((u) => u.id !== user.id);

//             toast.success(`${user.name} has been successfully deleted.`);
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             toast.error('Failed to delete user. Please try again.');
//         }
//     }
// };



const editUser = (user) => {
    console.log('Edit user:', user);
};

const messageUser = (user) => {
    console.log('Message user:', user);
};
</script>
