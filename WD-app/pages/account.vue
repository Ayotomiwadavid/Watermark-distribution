<!-- pages/account.vue -->
<template>
    <main>
        <Header />
        <div class="min-h-screen bg-gray-50 py-8">
            <div class="max-w-4xl mx-auto px-4">
                <h1 class="text-3xl font-bold mb-8">Account Settings</h1>

                <!-- User Info Section -->
                <div class="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" v-model="user.Name"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            </div>
                            <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" v-model="user.Email"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        </div>
                        </div>
                        
                        <div class="flex justify-end">
                            <button @click="updateProfile" :disabled="isLoading"
                                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                :class="{ 'opacity-50 cursor-not-allowed': isLoading }">
                                <span v-if="isLoading">Saving...</span>
                                <span v-else>Save Changes</span>
                            </button>
                        </div>

                        <div class="">
                            <h2 class="text-xl font-semibold mb-4">Security</h2>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-medium">Password</h3>
                                 
                                </div>
                                <button @click="showPasswordModal = true"
                                    class="text-indigo-600 hover:text-indigo-800 font-medium">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Security Section -->


                <!-- Password Change Modal -->
                <Teleport to="body">
                    <div v-if="showPasswordModal"
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div class="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 class="text-xl font-semibold mb-4">Change Password</h3>
                            <form @submit.prevent="changePassword" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input type="password" v-model="passwordForm.current"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">New Password</label>
                                    <input type="password" v-model="passwordForm.new"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required>
                                </div>

                                <div class="flex justify-end space-x-3">
                                    <button type="button" @click="closePasswordModal"
                                        class="text-gray-600 hover:text-gray-800 font-medium">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Teleport>
            </div>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const isLoading = ref(false)

const user = ref({
    Name: '',
    Username: '',
    Email: '',
});

const showPasswordModal = ref(false)
const passwordForm = reactive({
    current: '',
    new: '',
})

const fetchUserDetails = async () => {
    try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            toast.error('Access token is missing. Please log in again.')
            return
        }

        const response = await axios.get('https://watermark-distribution.onrender.com/api/user/details', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        user.value = response.data.userDetails
        console.log('User details', user)
    } catch (err) {
        console.error(err)
        toast.error('Failed to fetch user details.')
    }
}

const updateProfile = async () => {
    console.log(user.value)
    if (!user.value.ID) {
        toast.error('User ID is missing.')
        return
    }

    const token = localStorage.getItem("accessToken")

    isLoading.value = true
    try {
        await axios.put(`https://watermark-distribution.onrender.com/api/users/${user.value.ID}`,
            {
                name: user.value.Name,
                username: user.value.Username,
                email: user.value.Email,
            },

            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

        )
        toast.success('Profile updated successfully')
    } catch (error) {
        toast.error('Failed to update profile')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const changePassword = async () => {
    const token = localStorage.getItem("accessToken")
    try {
        if (!passwordForm.current || !passwordForm.new) {
            throw new Error('Please fill in all fields')
        }

        await axios.put(
            `https://watermark-distribution.onrender.com/api/user/change-password`,
            {
                password: passwordForm.current,
                newPassword: passwordForm.new,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        closePasswordModal()
        toast.success('Password updated successfully')
    } catch (error) {
        toast.error(error.message || 'Failed to update password')
        console.error(error)
    }
}

const closePasswordModal = () => {
    showPasswordModal.value = false
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
}

onMounted(fetchUserDetails)
</script>


<style scoped>
input {
    padding: 10px;
}
</style>