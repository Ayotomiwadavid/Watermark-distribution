<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div
      v-if="userDetails.Approval === true"
      class="max-w-4xl mt-4 md:mt-4 mx-auto p-4"
    >
      <h1 class="text-4xl font-medium mb-4 text-center">Watermark Editor</h1>
      <div class="relative">
        <div
          ref="containerRef"
          class="relative w-full aspect-video bg-gray-100 rounded overflow-hidden cursor-move"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
          @click="!baseImage && triggerFileUpload"
        >
          <img
            v-if="baseImage"
            ref="baseImageRef"
            :src="baseImage"
            alt="Base"
            class="w-full h-full md:w-full md:h-full object-contain"
          />
          <div
            v-if="baseImage && watermarkType === 'text'"
            :style="{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              color: textStyle.color,
              fontSize: `${textStyle.fontSize}px`,
              fontFamily: textStyle.fontFamily,
              fontWeight: textStyle.isBold ? 'bold' : 'normal',
              fontStyle: textStyle.isItalic ? 'italic' : 'normal',
            }"
            class="absolute select-none pointer-events-none"
          >
            {{ watermarkText }}
          </div>
          <img
            v-if="baseImage && watermarkType === 'image' && watermarkImage"
            ref="watermarkImageRef"
            :src="watermarkImage"
            alt="Watermark"
            :style="{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }"
            class="absolute w-24 h-24 object-contain select-none pointer-events-none"
          />
          <div
            v-if="!baseImage"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="text-center text-gray-500">
              <!-- <LucideUpload size="48" class="mx-auto mb-2" /> -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto text-center"
                width="4.5em"
                height="4.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 1.25a.75.75 0 0 1 .57.262l3 3.5a.75.75 0 1 1-1.14.976l-1.68-1.96V15a.75.75 0 0 1-1.5 0V4.027L9.57 5.988a.75.75 0 1 1-1.14-.976l3-3.5A.75.75 0 0 1 12 1.25M6.996 8.252a.75.75 0 0 1 .008 1.5c-1.093.006-1.868.034-2.457.142c-.566.105-.895.272-1.138.515c-.277.277-.457.666-.556 1.4c-.101.755-.103 1.756-.103 3.191v1c0 1.436.002 2.437.103 3.192c.099.734.28 1.122.556 1.4c.277.276.665.456 1.4.555c.754.102 1.756.103 3.191.103h8c1.435 0 2.436-.001 3.192-.103c.734-.099 1.122-.279 1.399-.556s.457-.665.556-1.399c.101-.755.103-1.756.103-3.192v-1c0-1.435-.002-2.436-.103-3.192c-.099-.733-.28-1.122-.556-1.399c-.244-.243-.572-.41-1.138-.515c-.589-.108-1.364-.136-2.457-.142a.75.75 0 1 1 .008-1.5c1.082.006 1.983.032 2.72.167c.758.14 1.403.405 1.928.93c.602.601.86 1.36.982 2.26c.116.866.116 1.969.116 3.336v1.11c0 1.368 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116c-.9-.121-1.658-.38-2.26-.982s-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337v-1.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.525-.524 1.17-.79 1.928-.929c.737-.135 1.638-.161 2.72-.167"
                  clip-rule="evenodd"
                />
              </svg>
              <p>Upload an image to begin</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            @change="handleBaseImageUpload"
            ref="fileInput"
            class="hidden"
          />
        </div>
        <img
          v-if="watermarkType === 'text'"
          ref="textWatermark"
          :style="{ position: 'absolute' }"
        />

        <img
          v-else-if="watermarkType === 'image' && watermarkImage"
          ref="imageWatermark"
          :src="watermarkImage"
          :style="{
            position: 'absolute',
            left: `${watermarkPosition.x}px`,
            top: `${watermarkPosition.y}px`,
            width: '100px',
            cursor: 'move',
            userSelect: 'none',
          }"
          @mousedown="startDragging"
          @touchstart="startDragging"
        />
      </div>

      <div class="">
        <!-- Image Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Upload Image</label
          >
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
      </div>
      <div class="flex w-full items-center justify-between mt-2">
        <div v-if="baseImage" class="flex gap-1">
          <NudgeButton direction="up" :icon="LucideArrowUp" />
          <div class="flex justify-start gap-1">
            <NudgeButton direction="left" :icon="LucideArrowLeft" />
            <NudgeButton direction="right" :icon="LucideArrowRight" />
          </div>
          <NudgeButton direction="down" :icon="LucideArrowDown" />
        </div>
        <button
          v-if="baseImage"
          @click="handleDownload"
          class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <!-- <LucideDownload size="20" /> -->
          Save
        </button>
      </div>
      <div class="my-6 space-y-4">
        <div class="flex gap-4">
          <button
            @click="setWatermarkType('text')"
            :class="`flex items-center gap-2 px-4 py-2 rounded ${
              watermarkType === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`"
          >
            <!-- <LucideType size="20" />  -->
            Text Watermark
          </button>
          <button
            @click="setWatermarkType('image')"
            :class="`flex items-center gap-2 px-4 py-2 rounded ${
              watermarkType === 'image'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`"
          >
            <!-- <LucideImage size="20" />  -->
            Image Watermark
          </button>
        </div>
        <div class="flex gap-4">
          <!-- <div class="flex-1">
                        <label class="block text-sm font-medium mb-2">Upload Base Image</label>
                        <input type="file" accept="image/*" @change="handleBaseImageUpload"
                            class="w-full p-2 border rounded" />
                    </div> -->
          <div v-if="watermarkType === 'image'" class="flex-1">
            <label class="block text-sm font-medium mb-2"
              >Upload Watermark Image</label
            >
            <input
              type="file"
              accept="image/*"
              @change="handleWatermarkImageUpload"
              class="w-full p-2 border rounded"
            />
          </div>
        </div>

        <!-- Text Watermark Options -->
        <div v-if="watermarkType === 'text'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Watermark Text</label
          >
          <input
            v-model="watermarkText"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
            placeholder="Enter watermark text"
          />

          <!-- Text Styling Options -->
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Font Size</label
              >
              <input
                v-model="textStyle.fontSize"
                type="number"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
                min="8"
                max="72"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Font Color</label
              >
              <input
                v-model="textStyle.color"
                type="color"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Font Weight</label
              >
              <select
                v-model="textStyle.fontWeight"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Font Style</label
              >
              <select
                v-model="textStyle.fontStyle"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Image Watermark Options -->
        <div v-if="watermarkType === 'image'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Upload Watermark Image</label
          >
          <input
            type="file"
            @change="handleWatermarkImageUpload"
            accept="image/*"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-4">
      <button
        @click="saveDraft"
        class="px-4 py-2 flex items-center bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
      >
        <Icon icon="mdi:content-save" class="mr-2" />
        Save Draft
      </button>
      <button
        @click="downloadImage"
        class="px-4 py-2 flex items-center bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <Icon icon="mdi:download" class="mr-2" />
        Download
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue/dist/iconify.js";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { toast } from "vue3-toastify";
import { useFirebase } from "~/composables/useFirebase";

const { saveDraftToFirebase } = useFirebase();

const canvas = ref(null);
const ctx = ref(null);
const baseImage = ref(null);
const watermarkType = ref("text");
const watermarkText = ref("Watermark");
const watermarkImage = ref(null);
const watermarkPosition = reactive({ x: 50, y: 50 });
const isDragging = ref(false);
const dragOffset = reactive({ x: 0, y: 0 });
const textStyle = reactive({
  fontSize: 24,
  color: "#000000",
  fontWeight: "normal",
  fontStyle: "normal",
});

const textWatermark = ref(null);
const imageWatermark = ref(null);

onMounted(() => {
  ctx.value = canvas.value.getContext("2d");
  window.addEventListener("mousemove", drag);
  window.addEventListener("mouseup", stopDragging);
  window.addEventListener("touchmove", drag);
  window.addEventListener("touchend", stopDragging);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", drag);
  window.removeEventListener("mouseup", stopDragging);
  window.removeEventListener("touchmove", drag);
  window.removeEventListener("touchend", stopDragging);
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      baseImage.value = new Image();
      baseImage.value.onload = () => {
        drawImage();
      };
      baseImage.value.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleWatermarkImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      watermarkImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const drawImage = () => {
  if (baseImage.value) {
    canvas.value.width = baseImage.value.width;
    canvas.value.height = baseImage.value.height;
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.value.drawImage(baseImage.value, 0, 0);
  }
};

// const startDragging = (event) => {
//     isDragging.value = true
//     dragOffset.x = event.clientX - watermarkPosition.x
//     dragOffset.y = event.clientY - watermarkPosition.y
// }

// const drag = (event) => {
//     if (isDragging.value) {
//         watermarkPosition.x = event.clientX - dragOffset.x
//         watermarkPosition.y = event.clientY - dragOffset.y
//     }
// }

// const stopDragging = () => {
//     isDragging.value = false
// }

const startDragging = (event) => {
  isDragging.value = true;
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;
  const rect = event.target.getBoundingClientRect();
  dragOffset.x = clientX - rect.left;
  dragOffset.y = clientY - rect.top;
};

const drag = (event) => {
  if (isDragging.value) {
    event.preventDefault();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const canvasRect = canvas.value.getBoundingClientRect();

    watermarkPosition.x = Math.min(
      Math.max(clientX - canvasRect.left - dragOffset.x, 0),
      canvasRect.width - (watermarkType.value === "image" ? 100 : 0)
    );
    watermarkPosition.y = Math.min(
      Math.max(clientY - canvasRect.top - dragOffset.y, 0),
      canvasRect.height - (watermarkType.value === "image" ? 100 : 0)
    );
  }
};

const stopDragging = () => {
  isDragging.value = false;
};

const saveDraft = async () => {
  const draft = {
    baseImage: baseImage.value.src,
    watermarkType: watermarkType.value,
    watermarkText: watermarkText.value,
    watermarkImage: watermarkImage.value,
    watermarkPosition,
    textStyle,
  };
  await saveDraftToFirebase(draft);
  alert("Draft saved successfully!");
  toast.success("Draft saved successfully!");
};

const downloadImage = () => {
  drawImage(); // Draw base image first

  if (watermarkType.value === "text") {
    ctx.value.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px Arial`;
    ctx.value.fillStyle = textStyle.color;
    ctx.value.fillText(
      watermarkText.value,
      watermarkPosition.x,
      watermarkPosition.y
    );
    
    // Move download logic here to ensure text is included
    const link = document.createElement("a");
    link.download = "watermarked-image.png";
    link.href = canvas.value.toDataURL();
    link.click();
    
  } else if (watermarkType.value === "image" && watermarkImage.value) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Ensure cross-origin images load
    img.onload = () => {
      ctx.value.drawImage(
        img,
        watermarkPosition.x,
        watermarkPosition.y,
        100,
        100
      );

      // Ensure the download happens after the watermark is drawn
      setTimeout(() => {
        const link = document.createElement("a");
        link.download = "watermarked-image.png";
        link.href = canvas.value.toDataURL();
        link.click();
      }, 100); // Small delay to ensure canvas updates
    };
    img.src = watermarkImage.value;
  }
};

</script>

<style>
input {
  padding: 10px;
}

select {
  padding: 10px;
}
</style>
