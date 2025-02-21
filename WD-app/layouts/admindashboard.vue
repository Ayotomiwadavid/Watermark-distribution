<template>
    <main>
        <!-- Sidebar (hidden on mobile when not toggled) -->
        <div :class="['fixed z-10 top-16 md:top-0', { hidden: !sidebarOpen && isMobile }]">
            <Sidebar />
        </div>

        <!-- Content Section -->
        <div :class="{ 'md:ml-64': !isMobile || sidebarOpen }">
            <!-- Navbar -->
          <Navbar :toggleSidebar="toggleSidebar"/>

            <!-- Main Content -->
            <div class="pt-16">
                <slot />
            </div>
        </div>
    </main>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
    setup() {
        const sidebarOpen = ref(false);
        const isMobile = ref(false);

        const toggleSidebar = () => {
            sidebarOpen.value = !sidebarOpen.value;
        };

        const checkMobile = () => {
            isMobile.value = window.innerWidth < 768;
        };

        onMounted(() => {
            checkMobile();
            window.addEventListener("resize", checkMobile);
        });

        return {
            sidebarOpen,
            isMobile,
            toggleSidebar,
        };
    },
};
</script>

<style>
.hidden {
    display: none;
}
</style>
