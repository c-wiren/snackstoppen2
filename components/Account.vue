<template>
    <div class="relative bg-white p-4">
        <button @click="state.overlay = null" class="absolute top-0 right-0 p-2">✕</button>
        <h1>Ditt konto</h1>
        <h2>{{ api.currentUser?.username }}</h2>
        <button @click="logout">Logga ut</button>
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
