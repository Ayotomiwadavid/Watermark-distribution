<template>
    <div class="container mx-auto p-4">
        <Header />
        <div class="max-w-6xl mx-auto mt-8">
            <h1 class="text-3xl font-bold mb-6">Your Drafts</h1>
            <div v-if="loading" class="text-center">
                <p class="text-lg">Loading drafts...</p>
            </div>
            <div v-else-if="error" class="text-center text-red-600">
                <p class="text-lg">Error loading drafts. Please try again.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="draft in drafts" :key="draft.id"
                    class="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <img :src="draft.baseImage" alt="Draft preview" class="w-full h-48 object-cover mb-4 rounded">
                    <p class="text-lg font-semibold mb-2">Draft {{ draft.id }}</p>
                    <p class="text-sm text-gray-600 mb-4">Watermark Type: {{ draft.watermarkType }}</p>
                    <NuxtLink :to="`/edit/${draft.id}`"
                        class="inline-block bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition-colors">
                        <Icon icon="mdi:pencil" class="mr-2" />
                        Edit Draft
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFirebase } from '~/composables/useFirebase'

const { getDraftsFromFirebase } = useFirebase()
const drafts = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    try {
        drafts.value = await getDraftsFromFirebase()
    } catch (e) {
        console.error('Error fetching drafts:', e)
        error.value = e
    } finally {
        loading.value = false
    }
})
</script>