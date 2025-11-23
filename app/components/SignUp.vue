<!--TODO: Fix styling -->
<template>
  <div class="dialog space-y-4">
    <div class="flex items-center justify-between">
      <h1>Skapa konto</h1>
      <button @click="state.overlay = null" class="-mr-1 rounded-lg p-2 text-gray-500">✕</button>
    </div>
    <form @submit.prevent="verifyEmail" v-if="emailVerificationToken.length <= 0">
      <fieldset :disabled="sendingVerificationCode" class="space-y-4">
        <div class="relative w-full">
          <span
            v-if="availableUsername === true && checkedUsername === username"
            class="absolute right-2 text-green-500"
            >✓</span
          >
          <span
            v-if="availableUsername === false && checkedUsername === username"
            class="absolute right-2 text-red-500"
            >✕</span
          >
          <label for="username" class="mb-2 block">Användarnamn</label>
          <input
            v-model="username"
            id="username"
            type="text"
            class="block"
            @input="scheduleCheckUserAvailability"
            @focusout="checkUserAvailability"
            required
            autofocus
          />
        </div>

        <label for="email" class="mb-2 block">E-postadress</label>
        <input
          v-model="email"
          id="email"
          type="email"
          class="block"
          required
          autocomplete="email"
        />

        <label for="password" class="mb-2 block">Lösenord</label>
        <input v-model="password" id="password" type="password" class="block" required />

        <label for="firstname" class="mb-2 block">Förnamn</label>
        <input
          v-model="firstname"
          id="firstname"
          type="text"
          class="block"
          autocomplete="given-name"
        />

        <label for="lastname" class="mb-2 block">Efternamn</label>
        <input
          v-model="lastname"
          id="lastname"
          type="text"
          class="block"
          autocomplete="family-name"
        />

        <button type="submit" class="btn btn-primary mt-4">
          {{ sendingVerificationCode ? "Skickar..." : "Skicka verifieringskod" }}
        </button>
      </fieldset>
    </form>
    <form @submit.prevent="signup" v-else>
      <p>Vi har skickat en verifieringskod till {{ email }}. Skriv in den här:</p>
      <input
        v-model="verificationCode"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        class="block"
        required
      />
      <button type="submit">{{ creatingAccount ? "Skickar..." : "Skicka" }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import state from "@/lib/ui-state";
import api from "@/lib/api";

const USER_AVAILABILITY_TIMEOUT = 1000;

let emailVerificationToken = ref("");

let email = ref("");
let username = ref("");
let password = ref("");
let firstname = ref("");
let lastname = ref("");
let verificationCode = ref("");
let sendingVerificationCode = ref(false);
let creatingAccount = ref(false);
let availableUsername = ref<boolean | null>(null);
let checkedUsername = ref<string | null>(null);

async function verifyEmail() {
  sendingVerificationCode.value = true;
  const result = await api.verifyEmail(email.value);
  if (result.ok) {
    emailVerificationToken.value = result.value.verificationToken;
  } else {
    // TODO: Hantera fel
  }
  sendingVerificationCode.value = false;
}

const cleanEmpty = (value: string): string | undefined => (value === "" ? undefined : value);

async function signup() {
  creatingAccount.value = true;
  const result = await api.signup({
    firstname: cleanEmpty(firstname.value),
    lastname: cleanEmpty(lastname.value),
    password: password.value,
    username: username.value,
    verificationCode: verificationCode.value,
    token: emailVerificationToken.value,
  });
  if (result.ok) {
    password.value = "";
    state.overlay = "account";
  } else {
    // TODO: Hantera fel
  }
  creatingAccount.value = false;
}

let userAvailabilityTimer: number | null = null;
function scheduleCheckUserAvailability() {
  if (userAvailabilityTimer !== null) {
    clearTimeout(userAvailabilityTimer);
  }
  userAvailabilityTimer = window.setTimeout(checkUserAvailability, USER_AVAILABILITY_TIMEOUT);
}

async function checkUserAvailability() {
  const newUsername = username.value;
  if (
    (checkedUsername.value == newUsername && availableUsername.value != null) ||
    newUsername.length < 2
  ) {
    return;
  }
  const result = await api.getUserAvailability(newUsername);
  checkedUsername.value = newUsername;
  if (result.ok) {
    availableUsername.value = result.value;
  } else {
    availableUsername.value = null;
  }
}
</script>
