<template>
    <NuxtLayout name="admindashboard">
        <div class="h-screen flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b flex items-center justify-between">
                <h1 class="text-2xl font-bold">Messages</h1>
                <button v-if="showChatRoom && isMobile" @click="goBackToConversations" class="text-blue-500 underline">
                    Back
                </button>
            </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Conversations List -->
        <div
          v-if="!showChatRoom || !isMobile"
          class="w-full md:w-1/3 border-r overflow-y-auto"
        >
          <div class="p-4">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search users..."
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

                    <div class="space-y-4 m-2">
                        <div class="" v-if="filteredConversations && filteredConversations.length > 0">
                            <div v-for="conversation in filteredConversations" :key="conversation.id"
                                @click="selectUser(conversation.sender, conversation.name)"
                                class=" cursor-pointer hover:bg-gray-100"
                                :class="{ 'bg-gray-100': selectedUser?._id === conversation.sender._id }">
                                <div
                                    class="flex justify-between items-start border border-gray-100 bg-white p-2 rounded mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-12 h-12 rounded-full flex items-center gap-2 justify-center text-white font-bold"
                                            :style="{ backgroundColor: getRandomColor(conversation.id) }">
                                            {{ conversation.name.charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <h3 class="font-semibold">{{ conversation.name }}</h3>
                                            <p class="text-sm text-gray-600 truncate">
                                                {{ conversation.messages[0].content }}
                                            </p>
                                        </div>
                                    </div>

                  <div class="flex flex-col items-end">
                    <span class="text-xs text-gray-500">
                      {{ formatDate(conversation.messages[0].createdAt) }}
                    </span>
                    <span
                      v-if="conversation.unread"
                      class="w-2 h-2 bg-blue-500 rounded-full mt-1"
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center h-[60vh] flex justify-center items-center"
            >
              <p class="text-gray-500 text-md">No Messages Yet</p>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div v-if="showChatRoom || !isMobile" class="flex-1 flex flex-col">
          <template v-if="selectedUser">
            <!-- Chat Header -->
            <div class="p-4 border-b">
              <h2 class="font-semibold">{{ selectedUser }}</h2>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                v-for="message in messages"
                :key="message._id"
                class="flex"
                :class="{ 'justify-end': message.senderType === 'Admin' }"
              >
                <div
                  class="max-w-[70%] rounded-lg px-4 py-2"
                  :class="{
                    'bg-blue-500 text-white': message.senderType === 'Admin',
                    'bg-gray-100': message.senderType === 'User',
                  }"
                >
                  <p>{{ message.content }}</p>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t">
              <form @submit.prevent="sendMessage" class="flex gap-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Type your message..."
                  class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </form>
            </div>
          </template>

          <!-- No Selected User State -->
          <div
            v-else
            class="flex-1 flex items-center justify-center text-gray-500"
          >
            Select a conversation to start messaging
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const selectedUser = ref(null);
const selectedUserId = ref(null);
const newMessage = ref("");
const searchQuery = ref("");
const conversations = ref([]);
const messages = ref([]);

const showChatRoom = ref(false);

const isMobile = computed(() => window.innerWidth < 768);


const goBackToConversations = () => {
  selectedUser.value = null;
  showChatRoom.value = false; // Go back to conversation list on mobile
};

const colors = [
  "#F87171", // Red
  "#FBBF24", // Yellow
  "#34D399", // Green
  "#60A5FA", // Blue
  "#A78BFA", // Purple
  "#F472B6", // Pink
];

const getRandomColor = (id) => {
  // Use id hash or fallback to Math.random for color selection
  const index = id
    ? id.charCodeAt(0) % colors.length
    : Math.floor(Math.random() * colors.length);
  return colors[index];
};

// Fetch messages and group by sender
const fetchMessages = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Access token is missing");
      return;
    }

    const data = await axios.get(
      "https://watermark-distribution.onrender.com/api/messages",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Testing:", data.data.messages);

    // Filter messages to only include those where senderType is 'User'
    const userMessages = data.data.messages.filter(
      (msg) => msg?.senderType === "User"
    );

        // Group messages by sender
        const groupedMessages = userMessages.reduce((acc, msg) => {
            const senderId = msg.sender._id;
            console.log("SenderId:", senderId);

      if (!acc[senderId]) {
        acc[senderId] = { messages: [], sender: msg.sender };
      }

      acc[senderId].messages.push(msg);
      return acc;
    }, {});

    // Fetch user names
    const userPromises = Object.keys(groupedMessages).map(async (id) => {
      const name = await fetchUserName(id);
      return { id, name, ...groupedMessages[id] };
    });

    conversations.value = await Promise.all(userPromises);
    console.log("Conversations:", conversations.value);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// Fetch username by ID
const fetchUserName = async (id) => {
  try {
    const data = await axios.get(
      `https://watermark-distribution.onrender.com/api/users/${id}`
    );
    console.log("chat user:", data.data);

        return data.data.user.username || "Unknown User";
    } catch (error) {
        console.error(`Error fetching username for ID ${id}:`, error);
        return "Unknown User";
    }
};

// Filter conversations based on search query
const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter((conv) =>
    conv.name.toLowerCase().includes(query)
  );
});

// Select a conversation
const selectUser = async (user, name) => {
  selectedUser.value = name;
  selectedUserId.value = user._id;
  showChatRoom.value = true;
  console.log("One user:", user);
  try {
    const data = await axios.get(
      `https://watermark-distribution.onrender.com/api/messages/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    messages.value = data.data.messages;
  } catch (error) {
    console.error("Error fetching user messages:", error);
  }
};

// Send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value) return;

  try {
    const token = localStorage.getItem("accessToken");

    await axios.post(
      `https://watermark-distribution.onrender.com/api/messages/${selectedUserId.value}`,
      { content: newMessage.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    messages.value.push({
      content: newMessage.value,
      senderType: "Admin",
      createdAt: new Date(),
    });
    newMessage.value = "";
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

// const fetchUserMessages = async (id) => {
//     try {
//         const { data } = await axios.get(
//             `https://watermark-distribution.onrender.com/api/messages/${id}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use token for protected endpoint
//                 },
//             }
//         );
//         messages.value = data.messages;
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//     }
// }


const formatDate = (dateString) => {
  if (!dateString) return "Invalid date";

  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date; // Difference in milliseconds
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Relative time logic
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  // Standard date format (e.g., "Jan 5, 2025, 2:30 PM")
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

onMounted(() => {
    if (process.client) {
        fetchMessages(); // Fetch only on the client-side
    }
});
</script>
