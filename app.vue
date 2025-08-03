<template>
  <NuxtLayout>
    <div class="min-h-screen">
      <NavigationBar />
      <NuxtPage class="grid min-h-screen place-content-center" />
    </div>
  </NuxtLayout>
  <div v-if="state.overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="state.overlay = null">
    <Login v-if="state.overlay == 'login'" @click.stop></Login>
    <SignUp v-if="state.overlay == 'signup'" @click.stop></SignUp>
    <Account v-if="state.overlay == 'account'" @click.stop></Account>
  </div>
</template>

<script setup lang="ts">
import state from "@/lib/ui-state";
import api from "@/lib/api";

onMounted(() => {
  api.loadSession();
});
</script>
