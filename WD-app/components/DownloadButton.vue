<template>
    <div class="p-4">
        <button @click="downloadImage" class="p-2 bg-blue-500 text-white rounded-md flex items-center space-x-2">
            <Icon icon="mdi:download" class="w-6 h-6" />
            <span>Download</span>
        </button>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const downloadImage = () => {
    const link = document.createElement('a')
    link.download = 'watermarked-image.png'
    link.href = canvas.value.toDataURL()
    link.click()
}
</script>