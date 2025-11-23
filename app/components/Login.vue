<!--TODO: Fix styling -->
<template>
  <div class="dialog space-y-4" :class="{ 'animate-shake': wrongCredentials }">
    <div class="flex items-center justify-between">
      <h1>Logga in</h1>
      <button @click="state.overlay = null" class="rounded-xl p-2">✕</button>
    </div>
    <form @submit.prevent="login" class="space-y-4">
      <label for="user" class="mb-2 block">Användarnamn / E-postadress</label>
      <input
        v-model="user"
        type="text"
        id="user"
        :disabled="signingIn"
        class="block"
        required
        @input="wrongCredentials = false"
        autofocus
        autocomplete="email"
      />
      <label for="password" class="mb-2 block">Lösenord</label>
      <input
        v-model="password"
        type="password"
        id="password"
        :disabled="signingIn"
        class="block"
        required
        @input="wrongCredentials = false"
        autocomplete="current-password"
      />
      <div v-if="wrongCredentials" class="text-red-500">Fel användarnamn eller lösenord</div>
      <button type="submit" :disabled="signingIn" class="btn btn-primary">
        {{ signingIn ? "Loggar in..." : "Logga in" }}
      </button>
    </form>
    <button @click="state.overlay = 'signup'" class="text-blue-700 underline underline-offset-4">
      Skapa konto
    </button>
  </div>
</template>

<script setup lang="ts">
import state from "@/lib/ui-state";
import api from "@/lib/api";

let user = ref("");
let password = ref("");
let signingIn = ref(false);
let wrongCredentials = ref(false);

async function login() {
  if (signingIn.value) return; // Prevent multiple submissions
  wrongCredentials.value = false;
  signingIn.value = true;
  const result = await api.login(user.value, password.value);
  if (result.ok) {
    user.value = "";
    password.value = "";
    state.overlay = "account";
  } else {
    wrongCredentials.value = true;
  }
  signingIn.value = false;
}
</script>
