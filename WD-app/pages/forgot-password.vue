<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
            <div class="flex justify-center mb-6">
                <div class="flex items-center">
                    <Icon icon="material-symbols:water-drop-outline-rounded" width="1.5em" height="1.5em"
                        class="text-blue-600" />
                    <span class="text-xl font-medium uppercase font-bold"> <span
                            class="text-blue-700">You</span>Guard</span>
                </div>
            </div>
            <h1 class="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
            <form @submit.prevent="submitEmail" class="space-y-4">
                <input v-model="email" type="email" placeholder="Enter your email"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit"
                    class="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    :disabled="loading">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Send Reset Link</span>
                </button>
            </form>
            <p v-if="message" class="mt-4 text-center text-green-500">{{ message }}</p>
            <p class="mt-4 text-center">
                <router-link to="/signin" class="text-blue-500 hover:underline">Back to Login</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';
import axios from 'axios';
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';

const email = ref('');
const loading = ref(false);
const error = ref('');
const debugInfo = ref(null);

const isValidEmail = computed(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
});

const submitEmail = async () => {
    if (!isValidEmail.value) {
        error.value = 'Please enter a valid email address';
        return;
    }

    loading.value = true;
    error.value = '';
    debugInfo.value = null;

    try {
        const response = await axios.post(
            "https://watermark-distribution.onrender.com/api/user/forgot-password",
            { email: email.value },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any required headers here
                },
                // Enable debug information
                validateStatus: null,
            }
        );

        // Log full response for debugging
        debugInfo.value = {
            status: response.status,
            data: response.data,
            headers: response.headers
        };

        if (response.status === 200 || response.status === 201) {
            toast.success(`Reset link sent to ${email.value}`);
            email.value = ''; // Clear the email field
        } else {
            throw new Error(response.data?.message || 'Failed to send reset link');
        }

    } catch (err) {
        console.error('Error details:', err);

        // More specific error handling
        if (err.response) {
            // Server responded with error
            error.value = err.response.data?.message || 'Server error occurred';
            debugInfo.value = {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
            };
        } else if (err.request) {
            // Request made but no response
            error.value = 'No response from server. Please try again.';
            debugInfo.value = { request: 'No response received' };
        } else {
            // Request setup error
            error.value = 'Failed to send request. Please try again.';
            debugInfo.value = { message: err.message };
        }

        toast.error(error.value);
    } finally {
        loading.value = false;
    }
};

</script>