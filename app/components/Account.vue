<template>
  <div class="dialog min-w-72 space-y-4">
    <div class="flex items-center justify-between">
      <h1>Ditt konto</h1>
      <button @click="state.overlay = null" class="p-2 text-gray-600">✕</button>
    </div>
    <h2 class="text-2xl">{{ api.currentUser?.username }}</h2>
    <NuxtLink :to="'/users/' + api.currentUser?.username" class="btn w-fit">Din profil</NuxtLink>
    <button @click="logout" class="btn">Logga ut</button>
  </div>
</template>

<script setup lang="ts">
import state from "@/lib/ui-state";
import api from "@/lib/api";

async function logout() {
  api.logout();
  state.overlay = null;
}
</script>
