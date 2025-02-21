<!-- pages/admin/profile.vue -->
<template>
    <NuxtLayout name="admindashboard">
        <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <!-- Header Card -->
                <div class="bg-white rounded-lg shadow-lg">
                    <div class="p-6">
                        <div class="flex flex-col md:flex-row items-center gap-6">
                            <div class="relative">
                                <div class="h-32 w-32 rounded-full bg-primary-50 relative overflow-hidden">
                                    <img v-if="adminData.avatar" :src="adminData.avatar"
                                        class="h-full w-full object-cover" alt="Profile Avatar" />
                                    <div v-else
                                        class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-2xl font-bold">
                                        {{ getInitials(adminData.name) }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-center md:text-left">
                                <h1 class="text-2xl font-bold text-gray-900">{{ adminData.name }}</h1>
                                <p class="text-gray-500">{{ adminData.email }}</p>
                                <p class="text-sm text-gray-400 mt-1">{{ adminData.title || 'System Administrator' }}
                                </p>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="border-b border-gray-200">
                        <nav class="flex -mb-px">
                            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                                'flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm',
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]">
                                {{ tab.name }}
                            </button>
                        </nav>
                    </div>

                    <!-- Profile Tab Content -->
                    <div v-if="activeTab === 'profile'" class="p-6">
                        <form @submit.prevent="handleProfileUpdate" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input v-model="profileForm.name" type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Email</label>
                                    <input disabled v-model="profileForm.email" type="email"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                </div>

                            </div>



                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Password Tab Content -->
                    <div v-if="activeTab === 'security'" class="p-6">
                        <form @submit.prevent="handlePasswordChange" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Current Password</label>
                                <div class="relative">
                                    <input :type="showPassword ? 'text' : 'password'"
                                        v-model="passwordForm.currentPassword"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="1.5em"
                                            height="1.5em" viewBox="0 0 20 20">
                                            <path fill="currentColor"
                                                d="M18.521 1.478a1 1 0 0 0-1.414 0L1.48 17.107a1 1 0 1 0 1.414 1.414L18.52 2.892a1 1 0 0 0 0-1.414zM3.108 13.498l2.56-2.56A4.2 4.2 0 0 1 5.555 10c0-2.379 1.99-4.309 4.445-4.309c.286 0 .564.032.835.082l1.203-1.202A13 13 0 0 0 10 4.401C3.44 4.4 0 9.231 0 10c0 .423 1.057 2.09 3.108 3.497zm13.787-6.993l-2.562 2.56c.069.302.111.613.111.935c0 2.379-1.989 4.307-4.444 4.307c-.284 0-.56-.032-.829-.081l-1.204 1.203c.642.104 1.316.17 2.033.17c6.56 0 10-4.833 10-5.599c0-.424-1.056-2.09-3.105-3.495" />
                                        </svg>


                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                            viewBox="0 0 1200 1200">
                                            <path fill="currentColor"
                                                d="M779.843 599.925c0 95.331-80.664 172.612-180.169 172.612c-99.504 0-180.168-77.281-180.168-172.612c0-95.332 80.664-172.612 180.168-172.612c99.505-.001 180.169 77.281 180.169 172.612M600 240.521c-103.025.457-209.814 25.538-310.904 73.557C214.038 351.2 140.89 403.574 77.394 468.219C46.208 501.218 6.431 549 0 599.981c.76 44.161 48.13 98.669 77.394 131.763c59.543 62.106 130.786 113.018 211.702 154.179C383.367 931.674 487.712 958.015 600 959.48c103.123-.464 209.888-25.834 310.866-73.557c75.058-37.122 148.243-89.534 211.74-154.179c31.185-32.999 70.962-80.782 77.394-131.763c-.76-44.161-48.13-98.671-77.394-131.764c-59.543-62.106-130.824-112.979-211.74-154.141C816.644 268.36 712.042 242.2 600 240.521m-.076 89.248c156.119 0 282.675 120.994 282.675 270.251S756.043 870.27 599.924 870.27S317.249 749.275 317.249 600.02c0-149.257 126.556-270.251 282.675-270.251" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">New Password</label>
                                <div class="relative">
                                    <input :type="showNewPassword ? 'text' : 'password'"
                                        v-model="passwordForm.newPassword"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                    <button type="button" @click="showNewPassword = !showNewPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" width="1.5em"
                                            height="1.5em" viewBox="0 0 20 20">
                                            <path fill="currentColor"
                                                d="M18.521 1.478a1 1 0 0 0-1.414 0L1.48 17.107a1 1 0 1 0 1.414 1.414L18.52 2.892a1 1 0 0 0 0-1.414zM3.108 13.498l2.56-2.56A4.2 4.2 0 0 1 5.555 10c0-2.379 1.99-4.309 4.445-4.309c.286 0 .564.032.835.082l1.203-1.202A13 13 0 0 0 10 4.401C3.44 4.4 0 9.231 0 10c0 .423 1.057 2.09 3.108 3.497zm13.787-6.993l-2.562 2.56c.069.302.111.613.111.935c0 2.379-1.989 4.307-4.444 4.307c-.284 0-.56-.032-.829-.081l-1.204 1.203c.642.104 1.316.17 2.033.17c6.56 0 10-4.833 10-5.599c0-.424-1.056-2.09-3.105-3.495" />
                                        </svg>


                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                            viewBox="0 0 1200 1200">
                                            <path fill="currentColor"
                                                d="M779.843 599.925c0 95.331-80.664 172.612-180.169 172.612c-99.504 0-180.168-77.281-180.168-172.612c0-95.332 80.664-172.612 180.168-172.612c99.505-.001 180.169 77.281 180.169 172.612M600 240.521c-103.025.457-209.814 25.538-310.904 73.557C214.038 351.2 140.89 403.574 77.394 468.219C46.208 501.218 6.431 549 0 599.981c.76 44.161 48.13 98.669 77.394 131.763c59.543 62.106 130.786 113.018 211.702 154.179C383.367 931.674 487.712 958.015 600 959.48c103.123-.464 209.888-25.834 310.866-73.557c75.058-37.122 148.243-89.534 211.74-154.179c31.185-32.999 70.962-80.782 77.394-131.763c-.76-44.161-48.13-98.671-77.394-131.764c-59.543-62.106-130.824-112.979-211.74-154.141C816.644 268.36 712.042 242.2 600 240.521m-.076 89.248c156.119 0 282.675 120.994 282.675 270.251S756.043 870.27 599.924 870.27S317.249 749.275 317.249 600.02c0-149.257 126.556-270.251 282.675-270.251" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {{ isSubmitting ? 'Updating...' : 'Update Password' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Alert Messages -->
                <div v-if="alert.show"
                    :class="`rounded-md p-4 ${alert.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`">
                    <p :class="`text-sm ${alert.type === 'success' ? 'text-green-700' : 'text-red-700'}`">
                        {{ alert.message }}
                    </p>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const tabs = [
    { id: 'profile', name: 'Profile Details' },
    { id: 'security', name: 'Security' }
]

const activeTab = ref('profile')
const adminData = ref({})
const isSubmitting = ref(false)
const fileInput = ref(null)
const showPassword = ref(false)
const showNewPassword = ref(false)


const alert = ref({
    show: false,
    type: '',
    message: ''
})




const setIsSubmitting = (value) => {
    isSubmitting.value = value
}

const profileForm = ref({
    name: '',
    email: '',
    phone: '',
    title: '',
    bio: ''
})

const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const getInitials = (name) => {
    return name
        ?.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase() || 'A'
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
        const formData = new FormData()
        formData.append('avatar', file)

        // TODO: Replace with your actual API endpoint
        const response = await axios.post('/api/admin/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })

        adminData.value.avatar = response.data.avatarUrl
        toast.success('Profile picture updated successfully')
    } catch (error) {
        console.error('Error uploading avatar:', error)
        toast.error('Failed to update profile picture')
    }
}

const handleProfileUpdate = async () => {
    try {
        setIsSubmitting(true)
        const token = localStorage.getItem('accessToken')

        await axios.put('https://watermark-distribution.onrender.com/api/admin/change-name',
            { name: profileForm.value.name },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        toast.success('Profile updated successfully')

        // Refresh admin data
        await fetchUserDetails()
    } catch (error) {
        console.error('Error updating profile:', error)
        toast.error('Failed to update profile')
    } finally {
        setIsSubmitting(false)
    }
}

const handlePasswordChange = async () => {


    if (passwordForm.value.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters long')
        return
    }

    try {
        isSubmitting.value = true
        const token = localStorage.getItem('accessToken')

        await axios.put('https://watermark-distribution.onrender.com/api/admin/change-password',
            {

                password: passwordForm.value.currentPassword,
                newPassword: passwordForm.value.newPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        toast.success('Password updated successfully')

        // Reset password form
        passwordForm.value = {
            currentPassword: '',
            newPassword: '',
        }

        isSubmitting.value = false
    } catch (error) {
        console.error('Error updating password:', error)
        toast.error('Failed to update password')
    } finally {
        isSubmitting.value = false
    }
}

const fetchUserDetails = async () => {
    try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            toast.error('Access token is missing. Please log in again.')
            return
        }

        const response = await axios.get('https://watermark-distribution.onrender.com/api/admin/details', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        adminData.value = response.data.adminInfo

        // Populate profile form with current data
        profileForm.value = {
            name: response.data.adminInfo.name || '',
            email: response.data.adminInfo.email || '',
            phone: response.data.adminInfo.phone || '',
            title: response.data.adminInfo.title || '',
            bio: response.data.adminInfo.bio || ''
        }
    } catch (err) {
        console.error(err)
        toast.error('Failed to fetch user details.')
    }
}

// Watch for alert changes to automatically hide them after 5 seconds
watch(() => alert.value.show, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            alert.value.show = false
        }, 5000)
    }
})

onMounted(async () => {
    await fetchUserDetails()
})
</script>

<style scoped>
input {
    padding: 10px
}

.transition-colors {
    transition: background-color 0.3s ease;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>