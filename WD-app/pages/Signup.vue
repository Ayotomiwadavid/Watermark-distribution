<template>
    <div>
        <section class="bg-white">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <div
                    class="relative hidden md:flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
                    <div class="absolute inset-0">
                        <img class="object-cover w-full h-full"
                            src="https://cdn.rareblocks.xyz/collection/celebration/images/signup/4/girl-working-on-laptop.jpg"
                            alt="" />
                    </div>
                    <div class="z-20">
                        <div class="flex z-20 items-center">
                            <Icon icon="material-symbols:water-drop-outline-rounded" width="4em" height="4em"
                                class="text-blue-600" />
                            <span class="text-6xl font-medium uppercase text-white font-bold"> <span
                                    class="text-blue-700">You</span>Guard</span>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                </div>

                <div class="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
                    <div class="xl:w-full xl:max-w-sm w-full xl:mx-auto">
                        <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
                        <p class="mt-2 text-base text-gray-600">Already have an account? <NuxtLink to="/signin" title=""
                                class="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">
                                Login</NuxtLink>
                        </p>

                        <form action="#" method="POST" class="mt-8">
                            <div class=" grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div class="col-span-2">
                                    <label for="" class="text-base font-medium text-gray-900"> Business name </label>
                                    <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                        <div
                                            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>

                                        <input type="text" name="" id="" placeholder="Enter your full name"
                                            class="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                            v-model="fullname" />
                                    </div>
                                </div>


                                <div class="col-span-2">
                                    <label for="" class="text-base font-medium text-gray-900"> Email address </label>
                                    <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                        <div
                                            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>

                                        <input type="email" name="" id="" placeholder="Enter email to get started"
                                            class="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                            v-model="email" />
                                    </div>
                                </div>

                                <div class="col-span-2">
                                    <label for="region" class="text-base font-medium text-gray-900">
                                        Select Region
                                    </label>
                                    <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">

                                        <select id="region"
                                            class="block w-full py-4 px-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                            v-model="selectedRegion">
                                            <option v-for="region in regions" :key="region._id" :value="region._id">
                                                {{ region.region }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-span-2">
                                    <label for="password" class="text-base font-medium text-gray-900"> Password </label>
                                    <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                        <div
                                            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                            </svg>
                                        </div>

                                        <input :type="showPassword ? 'text' : 'password'" name="password" id="password"
                                            placeholder="Enter your password"
                                            class="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                            v-model="password" />
                                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <button type="button" @click="togglePasswordVisibility"
                                                class="focus:outline-none">
                                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg"
                                                    width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" fill-rule="evenodd"
                                                        d="M12 17.8c4.034 0 7.686-2.25 9.648-5.8C19.686 8.45 16.034 6.2 12 6.2S4.314 8.45 2.352 12c1.962 3.55 5.614 5.8 9.648 5.8M12 5c4.808 0 8.972 2.848 11 7c-2.028 4.152-6.192 7-11 7s-8.972-2.848-11-7c2.028-4.152 6.192-7 11-7m0 9.8a2.8 2.8 0 1 0 0-5.6a2.8 2.8 0 0 0 0 5.6m0 1.2a4 4 0 1 1 0-8a4 4 0 0 1 0 8" />
                                                </svg>

                                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="1.5em"
                                                    height="1.5em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" fill-rule="evenodd"
                                                        d="m18.67 16.973l2.755 2.755l-.849.848L3.85 3.85L4.697 3l2.855 2.855C8.932 5.303 10.432 5 12 5c4.808 0 8.972 2.848 11 7a12.65 12.65 0 0 1-4.33 4.973M8.486 6.79l1.664 1.664a4 4 0 0 1 5.398 5.398l2.255 2.255c1.574-1 2.904-2.403 3.845-4.106C19.686 8.45 16.034 6.2 12 6.2a10.8 10.8 0 0 0-3.514.59m6.152 6.152a2.8 2.8 0 0 0-3.579-3.579zm1.81 5.204c-1.38.552-2.88.855-4.448.855c-4.808 0-8.972-2.848-11-7a12.65 12.65 0 0 1 4.33-4.973l.867.867A11.36 11.36 0 0 0 2.352 12c1.962 3.55 5.614 5.8 9.648 5.8a10.8 10.8 0 0 0 3.514-.59l.934.935zM8.453 10.15l.909.91a2.8 2.8 0 0 0 3.579 3.579l.91.908a4 4 0 0 1-5.398-5.398z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-full">
                                    <button type="button"
                                        class="md:inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-blue-600 focus:outline-none hover:opacity-80 focus:opacity-80"
                                        @click="signup">
                                        <span v-if="isLoading" class="mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                                viewBox="0 0 24 24">
                                                <circle cx="18" cy="12" r="0" fill="#fff">
                                                    <animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s"
                                                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                                        repeatCount="indefinite" values="0;2;0;0" />
                                                </circle>
                                                <circle cx="12" cy="12" r="0" fill="#fff">
                                                    <animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s"
                                                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                                        repeatCount="indefinite" values="0;2;0;0" />
                                                </circle>
                                                <circle cx="6" cy="12" r="0" fill="#fff">
                                                    <animate attributeName="r" begin="0" calcMode="spline" dur="1.5s"
                                                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                                        repeatCount="indefinite" values="0;2;0;0" />
                                                </circle>
                                            </svg>
                                        </span>
                                        <span v-else> Create Account</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
import { Icon } from '@iconify/vue/dist/iconify.js';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
    components: {
        Icon
    },

    data() {
        return {
            fullname: '',
            username: '',
            email: '',
            phonenumber: '',
            password: '',
            isLoading: false,
            regions: [], // List of regions from the API
            selectedRegion: null,
            showPassword: false, // Password visibility toggle
        }
    },
    methods: {
        async signup() {
            try {
                this.isLoading = true;
                const response = await axios.post('https://watermark-distribution.onrender.com/api/user/signup', {
                    fullName: this.fullname,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    region: this.selectedRegion
                })

                const data = await response.data
                localStorage.setItem("Email-onSignup", data.email)
                toast.success("Account created");
                navigateTo('/signin')
                console.log(data)
                this.isLoading = false;
            } catch (error) {
                toast.error('An error occurred. Please try again later.')
                console.error(error)
                this.isLoading = false;
            }
        },

        async fetchRegions() {
            try {
                const response = await axios.get('https://watermark-distribution.onrender.com/api/regions'); // Replace with your API endpoint
                const data = await response.data;
                this.regions = data.regions || []; // Assuming API response has a `regions` array
                console.log("Regions", data.regions);

            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        },

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        }
    },

    mounted() {
        this.fetchRegions();
    },
}
</script>

<style></style>