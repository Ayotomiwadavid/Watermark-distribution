<template>
    <div class="min-h-screen bg-gray-50 ">

        <Header />



        <main class="max-w-5xl mx-auto px-4 py-8">
            <!-- Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Welcome back, {{ userDetails.Username }} </h2>
                        <p class="text-gray-500 mt-1">{{ userDetails.Email }}</p>
                    </div>
                    <div v-if="userDetails?.Approval !== undefined"
                        :class="`px-3 py-1 rounded-full text-sm font-medium ${userDetails.Approval === true || userDetails.Approval === 'true' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`">
                        {{ userDetails?.Approval === true || userDetails?.Approval === 'true' ? 'Approved' : 'Pending Approval' }}
                    </div>


                </div>
            </div>

            <div class="grid md:grid-cols-1 gap-6">
                <!-- Software Section -->
                <!-- <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Software</h3>
                        <span class="text-sm text-gray-500 capitalize"> {{ currentVersion.version
                            }} </span>
                    </div>

                    <div v-if="userDetails.Approval === true" class="space-y-4">
                        <div class="" v-for="(software, index) in softwares" :key="software.id">
                            <button v-if="index === 0" @click="downloadSoftware(software.id)"
                                class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                                <Icon name="mdi:download" class="h-5 w-5" />
                                <span>Download Software</span>
                            </button>
                        </div>


                        <p v-if="needsUpdate" class="text-sm text-amber-600 flex items-center space-x-2">
                            <Icon icon="mingcute:warning-line" class="h-5 w-5" />
                            <span v-if="notifications">{{ notifications[0].content }}</span>
                        </p>
                    </div>
                    <div v-else class="bg-gray-50 rounded-lg p-4">
                        <p class="text-gray-600 text-sm">
                            Your account is pending approval. Once approved, you'll be able to download the software.
                        </p>
                    </div>
                </div> -->

                <!-- Messages Section -->
                <UserMessaging />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Icon } from "@iconify/vue";

definePageMeta({
    middleware: 'auth'
})

const userDetails = ref({})


const fetchUserDetails = async () => {
    try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get('https://watermark-distribution.onrender.com/api/user/details',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        userDetails.value = response.data.userDetails;
        console.log("User details", userDetails);

    } catch (err) {
        console.error(err);

    }
}

let currentVersion = {
    version: '',
    releaseDate: new Date(),
    downloads: 1254,
}

const needsUpdate = ref(true);


// Example software list
const softwares = ref([
]);

const softwareId = ref('')
const notifications = ref([]);
const versionHistory = ref([])
// Sort the software list by release date (descending order)
softwares.value.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

const fetchAllSoftwares = async () => {
    try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get('https://watermark-distribution.onrender.com/api/softwares', {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });
        softwares.value = response.data.softwares
        softwareId.value = response.data.softwares[0]._id
        currentVersion.value = response.data.softwares[0].version
        console.log(softwares.value);

    } catch (error) {
        console.log(error);

    }
}

const fetchVersions = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return alert('Please login to view versions');
    }
    try {
        const response = await axios.get(
            'https://watermark-distribution.onrender.com/api/softwares',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.data;
        if (data.success) {
            versionHistory.value.push(data.softwares);

            // Assign the latest software to currentVersion
            if (versionHistory.value.length > 0) {
                const latestVersion = versionHistory.value[0]; // Assuming latest version is first in the list
                currentVersion.value = {
                    version: latestVersion.version,
                    releaseDate: latestVersion.releaseDate || new Date(),
                    downloads: latestVersion.downloads || 0,
                };
            } else {
                // Reset currentVersion if no software is available
                currentVersion.value = {
                    version: '',
                    releaseDate: null,
                    downloads: 0,
                };
            }
        } else {
            alert(data.message || 'Failed to fetch software versions');
        }
    } catch (error) {
        console.error('Error fetching versions:', error);
    }
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

const downloadSoftware = async () => {
    console.log("SoftwareId:", softwareId.value);

    const token = localStorage.getItem("accessToken");
    try {
        const data = await axios.get(
            `https://watermark-distribution.onrender.com/api/softwares/download/${softwareId.value}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Assuming the response contains a downloadUrl
        const downloadUrl = data.data.downloadUrl;

        console.log("Download url:", downloadUrl);

        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `software-${softwareId.value}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading software:', error);
    }
};



// Logout


onMounted(fetchUserDetails)
onMounted(fetchAllSoftwares)
onMounted(fetchAllNotifications)
onMounted(fetchVersions)
</script>
