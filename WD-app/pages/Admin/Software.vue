<!-- pages/admin/software.vue -->
<template>
    <NuxtLayout name="admindashboard">
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-semibold text-gray-900">Software Management</h1>
                    <p class="mt-1 text-sm text-gray-500">Manage software versions and updates</p>
                </div>

                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Upload New Version -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-lg font-medium text-gray-900 mb-4">Upload New Version</h2>

                            <div class="space-y-6">
                                <!-- Version Info -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Software Name
                                        </label>
                                        <input v-model="newVersion.name" type="text" placeholder="Software A"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Version Number
                                        </label>
                                        <input v-model="newVersion.version" type="text" placeholder="e.g., 2.1.0"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>

                                </div>

                                <!-- Release Notes -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Release Notes
                                    </label>
                                    <textarea v-model="newVersion.description" rows="4"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe what's new in this version..."></textarea>
                                </div>

                                <!-- File Upload -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700">
                                        Software File
                                    </label>
                                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                        @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                                        <div v-if="!newVersion.file" class="space-y-2">
                                            <Icon name="mdi:cloud-upload" class="h-10 w-10 text-gray-400 mx-auto" />
                                            <div class="text-sm text-gray-600">
                                                <span class="text-blue-500 font-medium">Click to upload</span> or drag
                                                and drop
                                            </div>
                                            <p class="text-xs text-gray-500">
                                                Only .apk files are allowed
                                            </p>
                                        </div>
                                        <div v-else class="space-y-2">
                                            <Icon name="mdi:file-check" class="h-10 w-10 text-green-500 mx-auto" />
                                            <p class="text-sm text-gray-900 font-medium">{{ newVersion.file.name }}</p>
                                            <button @click.stop="removeFile"
                                                class="text-xs text-red-600 hover:text-red-800">
                                                Remove file
                                            </button>
                                        </div>
                                    </div>
                                    <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect"
                                        accept=".zip,.exe,.dmg" />
                                </div>

                                <!-- Upload Button -->
                                <div class="flex justify-end">
                                    <button @click="uploadVersion"
                                        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                        :disabled="!isFormValid">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                            viewBox="0 0 1024 1024">
                                            <path fill="currentColor"
                                                d="M544 864V672h128L512 480L352 672h128v192H320v-1.6c-5.376.32-10.496 1.6-16 1.6A240 240 0 0 1 64 624c0-123.136 93.12-223.488 212.608-237.248A239.81 239.81 0 0 1 512 192a239.87 239.87 0 0 1 235.456 194.752c119.488 13.76 212.48 114.112 212.48 237.248a240 240 0 0 1-240 240c-5.376 0-10.56-1.28-16-1.6v1.6z" />
                                        </svg>
                                        <span>Upload Version</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Current Version Card -->
                    <div class="bg-white h-[30vh] rounded-lg shadow p-6">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-medium text-gray-900">Current Version</h2>
                            <span class="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <p class="text-2xl font-semibold text-gray-900">{{ currentVersion.version }}</p>
                                <p class="text-sm text-gray-500">
                                    Released on {{ formatDate(currentVersion.releaseDate) }}
                                </p>
                            </div>
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                                <svg class="text-blue-600" xmlns="http://www.w3.org/2000/svg" width="1.5em"
                                    height="1.5em" viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd"
                                        d="M14.5 10.67V13a2.5 2.5 0 0 1-5 0v-2.33a5.02 5.02 0 0 0-2.064 2.285c-.163.364-.245.546-.303.627c-.176.247-.318.339-.616.399C6.419 14 6.28 14 6 14a3 3 0 0 0 0 6h12a3 3 0 1 0 0-6c-.28 0-.42 0-.517-.02c-.298-.06-.44-.152-.616-.4c-.058-.08-.14-.262-.303-.626A5.02 5.02 0 0 0 14.5 10.67"
                                        clip-rule="evenodd" />
                                    <path fill="currentColor"
                                        d="m12 3l-.707-.707l.707-.707l.707.707zm1 10a1 1 0 1 1-2 0zM7.293 6.293l4-4l1.414 1.414l-4 4zm5.414-4l4 4l-1.414 1.414l-4-4zM13 3v10h-2V3z" />
                                </svg>
                                <span>{{ currentVersion.downloads }} downloads</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Version History -->
                <div class="mt-8">
                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h2 class="text-lg font-medium text-gray-900">Version History</h2>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Version
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Release Date
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Downloads
                                        </th>
                                        <!-- <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th> -->
                                        <th
                                            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="version in versionHistory" :key="version.version">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ version.name }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ version.version }}

                                            </div>
                                            <div class="text-sm text-gray-500">
                                                Size: {{ version.fileSize }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatDate(version.uploadedAt) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ version.downloads || 'N/A' }}
                                        </td>
                                        <!-- <td class="px-6 py-4 whitespace-nowrap">
                                            <span :class="`px-2 py-1 text-xs font-medium rounded-full ${version.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`">
                                                {{ version.status }}
                                            </span>
                                        </td> -->
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div class="flex justify-end space-x-3">
                                                <button @click="downloadVersion(version)"
                                                    class="text-blue-600 hover:text-blue-900">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                                        viewBox="0 0 24 24">
                                                        <path fill="none" stroke="currentColor" stroke-linecap="round"
                                                            stroke-linejoin="round" stroke-width="2"
                                                            d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5l5-5m-5-7v12" />
                                                    </svg>
                                                </button>

                                                <!-- <button v-if="version.status !== 'active'"
                                                    @click="setActiveVersion(version)"
                                                    class="text-green-600 hover:text-green-900">
                                                    <Icon name="mdi:check-circle" class="h-5 w-5" />
                                                </button> -->
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>




<script>
import axios from 'axios';

export default {
    data() {
        return {
            newVersion: {
                version: '',
                description: '',
                name: '',
                file: null,
            },
            currentVersion: {
                version: '',
                releaseDate: new Date(),
                downloads: 1254,
            },
            versionHistory: [],
        };
    },
    computed: {
        isFormValid() {
            return (
                this.newVersion.version &&
                this.newVersion.name &&
                this.newVersion.description &&
                this.newVersion.file
            );
        },
    },
    methods: {
        async fetchVersions() {
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
                    this.versionHistory = data.softwares;

                    // Assign the latest software to currentVersion
                    if (this.versionHistory.length > 0) {
                        const latestVersion = this.versionHistory[0]; // Assuming latest version is first in the list
                        this.currentVersion = {
                            version: latestVersion.version,
                            releaseDate: latestVersion.releaseDate || new Date(),
                            downloads: latestVersion.downloads || 0,
                        };
                    } else {
                        // Reset currentVersion if no software is available
                        this.currentVersion = {
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
        },

        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            this.newVersion.file = event.target.files[0];
        },
        handleFileDrop(event) {
            this.newVersion.file = event.dataTransfer.files[0];
        },
        removeFile() {
            this.newVersion.file = null;
        },
        async uploadVersion() {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return alert('Please login to upload software');
            }

            // Check if the file exists
            if (!this.newVersion.file || !(this.newVersion.file instanceof File)) {
                return alert('Please select a valid file to upload');
            }

            const formData = new FormData();
            formData.set('name', this.newVersion.name);
            formData.set('version', this.newVersion.version);
            formData.set('description', this.newVersion.description);
            formData.set('file', this.newVersion.file);  // Fixed: Added the file

            try {
                const response = await axios.post(
                    'https://watermark-distribution.onrender.com/api/softwares/new',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.data.success) {
                    alert('Software uploaded successfully');

                    // Update the version history and set the latest software to currentVersion
                    this.fetchVersions();
                    const latestVersion = response.data.softwares; // Assuming the API returns the uploaded software details
                    if (latestVersion) {
                        this.currentVersion = {
                            version: latestVersion.version,
                            releaseDate: latestVersion.releaseDate || new Date(),
                            downloads: latestVersion.downloads || 0,
                        };
                    }
                } else {
                    alert(response.data.message || 'Failed to upload software');
                }
            } catch (error) {
                console.error('Error uploading software:', error);
                alert(
                    error.response?.data?.message ||
                    'An error occurred while uploading the software. Please try again.'
                );
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        handleAction(version) {
            alert(`Version: ${version.version}`);
        },
    },
    mounted() {
        this.fetchVersions();
    },
};
</script>
