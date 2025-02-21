<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>
            <form @submit.prevent="submitPasswordReset" class="space-y-4">
                <!-- New Password -->
                <div>
                    <label for="new-password" class="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input id="new-password" type="password" v-model="newPassword" @input="validatePassword" required
                        placeholder="Enter your new password"
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <!-- Password Strength Indicator -->
                    <p class="mt-1 text-sm" :class="passwordStrength.color">
                        {{ passwordStrength.message }}
                    </p>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input id="confirm-password" type="password" v-model="confirmPassword" @input="checkPasswordsMatch"
                        required placeholder="Confirm your new password"
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <!-- Password Match Indicator -->
                    <p v-if="confirmPassword" class="mt-1 text-sm" :class="passwordMatch.color">
                        {{ passwordMatch.message }}
                    </p>
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="loading || !isFormValid"
                    class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300">
                    <span v-if="loading">Resetting...</span>
                    <span v-else>Reset Password</span>
                </button>
            </form>

            <!-- Success/Error Message -->
            <p v-if="message" :class="{
                'text-red-500': error,
                'text-green-500': !error,
            }" class="text-sm text-center mt-4">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const token = route.query.token; // Retrieve token from query parameters
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const message = ref("");
const error = ref(false);
const isFormValid = ref(false);

// Password strength and match indicators
const passwordStrength = ref({ message: "Enter a password", color: "text-gray-500" });
const passwordMatch = ref({ message: "", color: "" });

const validatePassword = () => {
    const password = newPassword.value;
    if (!password) {
        passwordStrength.value = { message: "Enter a password", color: "text-gray-500" };
        isFormValid.value = false;
        return;
    }
    if (password.length < 8) {
        passwordStrength.value = { message: "Password is too short", color: "text-red-500" };
        isFormValid.value = false;
    } else if (!/[A-Z]/.test(password)) {
        passwordStrength.value = { message: "Add at least one uppercase letter", color: "text-orange-500" };
        isFormValid.value = false;
    } else if (!/[0-9]/.test(password)) {
        passwordStrength.value = { message: "Add at least one number", color: "text-orange-500" };
        isFormValid.value = false;
    } else if (!/[@$!%*?&#]/.test(password)) {
        passwordStrength.value = { message: "Add at least one special character", color: "text-orange-500" };
        isFormValid.value = false;
    } else {
        passwordStrength.value = { message: "Strong password", color: "text-green-500" };
        isFormValid.value = true;
    }
    checkPasswordsMatch();
};

const checkPasswordsMatch = () => {
    if (confirmPassword.value) {
        if (newPassword.value === confirmPassword.value) {
            passwordMatch.value = { message: "Passwords match", color: "text-green-500" };
            isFormValid.value = true;
        } else {
            passwordMatch.value = { message: "Passwords do not match", color: "text-red-500" };
            isFormValid.value = false;
        }
    } else {
        passwordMatch.value = { message: "", color: "" };
    }
};

const submitPasswordReset = async () => {
    if (!isFormValid.value) return;
    loading.value = true;
    const token = route.params.token;
    try {
        await axios.put(`https://watermark-distribution.onrender.com/api/user/reset-password/${token}`, {
            password: newPassword.value,
        });
        message.value = "Password reset successfully!";
        error.value = false;
        toast.success("Password reset successfully");
        // Redirect user to login page
        setTimeout(() => {
            router.push("/signin");
        }, 2000);
    } catch (err) {
        console.error("Error resetting password:", err);
        message.value = "Failed to reset password. Please try again.";
        error.value = true;
    } finally {
        loading.value = false;
    }
};
</script>
