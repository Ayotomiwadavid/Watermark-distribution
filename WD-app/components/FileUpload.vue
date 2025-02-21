<template>
    <div class="p-4">
        <label class="block text-sm font-medium text-gray-700">Upload Image</label>
        <input type="file" @change="onFileChange"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" accept="image/*" />
    </div>
</template>

<script setup>
const emit = defineEmits(['file-uploaded'])

const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            emit('file-uploaded', e.target.result)
        }
        reader.readAsDataURL(file)
    }
}
</script>