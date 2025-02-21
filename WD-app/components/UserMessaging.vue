<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="flex items-center  text-lg font-semibold text-gray-900 mb-6">
            <svg class="text-blue-600" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M11 21v-2h8v-7.1q0-2.925-2.037-4.962T12 4.9T7.038 6.938T5 11.9V18H4q-.825 0-1.412-.587T2 16v-2q0-.525.263-.987T3 12.275l.075-1.325q.2-1.7.988-3.15t1.975-2.525T8.762 3.6T12 3t3.225.6t2.725 1.663t1.975 2.512t1 3.15l.075 1.3q.475.225.738.675t.262.95v2.3q0 .5-.262.95t-.738.675V19q0 .825-.587 1.413T19 21zm-2-7q-.425 0-.712-.288T8 13t.288-.712T9 12t.713.288T10 13t-.288.713T9 14m6 0q-.425 0-.712-.288T14 13t.288-.712T15 12t.713.288T16 13t-.288.713T15 14m-8.975-1.55Q5.85 9.8 7.625 7.9T12.05 6q2.225 0 3.913 1.412T18 11.026Q15.725 11 13.813 9.8t-2.938-3.25q-.4 2-1.687 3.563T6.025 12.45" />
            </svg>
            Chat Support
        </h3>

        <div class="space-y-4">
            <div class="h-[200px] overflow-y-auto space-y-4">
                <!-- Display 'No messages' message if the list is empty -->
                <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
                    No messages yet
                </div>

                <!-- Loop through messages -->
                <div v-for="message in messages" :key="message._id" :class="`p-3 rounded-lg text-sm ${message.senderType === 'User' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-900'
                    } flex flex-col space-y-2`">
                    <!-- Header for sender and time -->
                    <div class="flex justify-between items-start mb-1">
                        <!-- Sender name -->
                        <span class="font-medium">

                            {{ message.senderType === 'User' ? 'You' : 'Admin' }}
                        </span>

                        <!-- Message time -->
                        <span class="text-xs text-gray-500">
                            {{ formatDate(message.createdAt) }}
                        </span>
                    </div>

                    <!-- Message content -->
                    <div>{{ message.content }}</div>
                </div>

            </div>


            <!-- Message Input -->
            <div class="flex items-center space-x-2">
                <input v-model="newMessage" type="text" placeholder="Type your message..."
                    class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @keyup.enter="sendMessage">
                <button @click="sendMessage"
                    class="bg-blue-500 hover:bg-blue-600 text-white p-2 py-3 px-3 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="m3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const newMessage = ref('');
const messages = ref([]);


const fetchMessages = async (id) => {
    try {
        console.log("UserIDD", id)
        const data = await axios.get(
            `https://watermark-distribution.onrender.com/api/messages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use token for protected endpoint
                },
            }
        );
        messages.value = data.data.messages;
        console.log("User chatss", messages.value || []);

    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const getSenderName = (message) => {
    // Customize sender display logic based on senderType
    return message.sender._id === localStorage.getItem("userId")
        ? "You"
        : `User ${message.sender._id}`;
}

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    const messageContent = newMessage.value;
    newMessage.value = ''; // Clear the input field immediately

    console.log("Userdet", userDetails.value)

    try {
        // Retrieve the token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token not found. Please log in again.');
            return;
        }

        // Make the API request with the token in the headers
        await axios.post(
            `https://watermark-distribution.onrender.com/api/messages/${userDetails.value}`,
            { content: messageContent },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Fetch the latest messages after sending
        await fetchMessages(userDetails.value);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

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
        userDetails.value = response.data.userDetails.ID;
        const id = response.data.userDetails.ID
        await fetchMessages(id)
        console.log("User details", id);

    } catch (err) {
        console.error(err);

    }
}

// Fetch messages on mount
// onMounted(fetchMessages);
onMounted(fetchUserDetails)

</script>

<style></style>