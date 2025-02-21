<!-- pages/admin/users.vue -->
<template>
    <NuxtLayout name="admindashboard">
        <div class="min-h-screen bg-white py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               

                <!-- Table -->
                <div class="bg-white rounded-lg">
                    <div class="overflow-x-auto">
                      <UserTable  />
                    </div>

                    <!-- Pagination -->
                    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <select v-model="itemsPerPage"
                                    class="border border-gray-300 rounded-lg px-2 py-1 text-sm">
                                    <option :value="10">10 / page</option>
                                    <option :value="20">20 / page</option>
                                    <option :value="50">50 / page</option>
                                </select>
                            </div>
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
                </div>
            </div>
        </div>
    </NuxtLayout>

</template>

<script setup>
const searchQuery = ref('');
const selectedRegion = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortColumn = ref('name');
const sortDirection = ref('asc');

const headers = [
    { key: 'name', label: 'Name' },
    { key: 'nickname', label: 'Nickname' },
    { key: 'phone', label: 'Phone' },
    { key: 'region', label: 'Region' },
    { key: 'status', label: 'Status' },
];

const regions = ['Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 5', 'Region 6'];

// Sample user data
const users = ref([
    {
        id: 1,
        name: 'John Doe',
        nickname: 'johnd',
        email: 'john@example.com',
        phone: '+1234567890',
        region: 'Region 1',
        status: 'Approved'
    },
    // Add more sample users here
]);

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
        case 'Approved':
            return 'bg-green-100 text-green-700';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'Revoked':
            return 'bg-red-100 text-red-700';
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

const toggleApproval = (user) => {
    user.status = user.status === 'Approved' ? 'Revoked' : 'Approved';
};

const editUser = (user) => {
    // Implement edit functionality
    console.log('Edit user:', user);
};

const messageUser = (user) => {
    // Implement message functionality
    console.log('Message user:', user);
};
</script>