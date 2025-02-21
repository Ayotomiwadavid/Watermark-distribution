<template>
    <div class="p-4">
        <canvas ref="canvas" class="border border-gray-300"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const ctx = ref(null)

onMounted(() => {
    ctx.value = canvas.value.getContext('2d')
})

const drawImage = (imageSrc) => {
    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
        canvas.value.width = img.width
        canvas.value.height = img.height
        ctx.value.drawImage(img, 0, 0)
    }
}

const drawTextWatermark = ({ text, fontSize, color }) => {
    ctx.value.font = `${fontSize}px Arial`
    ctx.value.fillStyle = color
    ctx.value.fillText(text, 50, 50)
}

const drawImageWatermark = (imageSrc) => {
    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
        ctx.value.drawImage(img, 50, 50, 100, 100)
    }
}

defineExpose({ drawImage, drawTextWatermark, drawImageWatermark })
</script>