<!--TODO: Fix styling -->
<template>
    <div class="relative bg-white p-4">
        <button @click="state.overlay = null" class="absolute top-0 right-0 p-2">✕</button>
        <h1>Logga in</h1>
        <form @submit.prevent="login">
            <input v-model="user" type="text" placeholder="Användare" :disabled="signingIn" class="block" required
                @input="wrongCredentials = false" />
            <input v-model="password" type="password" placeholder="Lösenord" :disabled="signingIn" class="block"
                required @input="wrongCredentials = false" />
            <div v-if="wrongCredentials" class="text-red-500">Fel användarnamn eller lösenord</div>
            <button type="submit" :disabled="signingIn">{{ signingIn ? "Loggar in..." : "Logga in" }}</button>
        </form>
        <button @click="state.overlay = 'signup'">Skapa konto</button>
    </div>
</template>

<script setup lang="ts">
import state from "@/lib/ui-state";
import api from "@/lib/api";

let user = ref('');
let password = ref('');
let signingIn = ref(false);
let wrongCredentials = ref(false);

async function login() {
    if (signingIn.value) return; // Prevent multiple submissions
    signingIn.value = true;
    const result = await api.login(user.value, password.value);
    if (result.ok) {
        user.value = '';
        password.value = '';
        state.overlay = 'account';
    }
    else {
        wrongCredentials.value = true;
    }
    signingIn.value = false;
}
</script>
