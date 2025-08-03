<!--TODO: Fix styling -->
<template>
    <div class="relative bg-white p-4">
        <button @click="state.overlay = null" class="absolute top-0 right-0 p-2">✕</button>
        <h1>Skapa konto</h1>
        <form @submit.prevent="verifyEmail" v-if="emailVerificationToken.length <= 0">
            <fieldset :disabled="sendingVerificationCode">
                <input v-model="email" type="email" placeholder="Mailadress" class="block" required />
                <div class="relative w-full">
                    <span v-if="availableUsername === true && checkedUsername === username"
                        class="text-green-400 absolute right-2">✓</span>
                    <span v-if="availableUsername === false && checkedUsername === username"
                        class="text-red-400 absolute right-2">✕</span>
                    <input v-model="username" type="text" placeholder="Användarnamn" class="block"
                        @input="scheduleCheckUserAvailability" @focusout="checkUserAvailability" required />
                </div>
                <input v-model="password" type="password" placeholder="Lösenord" class="block" required />
                <input v-model="firstname" type="text" placeholder="Förnamn" class="block" />
                <input v-model="lastname" type="text" placeholder="Efternamn" class="block" />
                <button type="submit">{{ sendingVerificationCode ? "Skickar..." :
                    "Skicka verifieringskod"
                }}</button>
            </fieldset>
        </form>
        <form @submit.prevent="signup" v-else>
            <p>Vi har skickat en verifieringskod till {{ email }}. Skriv in den här:</p>
            <input v-model="verificationCode" type="text" inputmode="numeric" autocomplete="one-time-code" class="block"
                required />
            <button type="submit">{{ creatingAccount ? "Skickar..." : "Skicka" }}</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import state from "@/lib/ui-state";
import api from "@/lib/api";

const USER_AVAILABILITY_TIMEOUT = 1000;

let emailVerificationToken = ref('');

let email = ref('');
let username = ref('');
let password = ref('');
let firstname = ref('');
let lastname = ref('');
let verificationCode = ref('');
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

const cleanEmpty = (value: string): string | undefined => value === "" ? undefined : value;

async function signup() {
    creatingAccount.value = true;
    const result = await api.signup({
        "firstname": cleanEmpty(firstname.value),
        "lastname": cleanEmpty(lastname.value),
        "password": password.value,
        "username": username.value,
        "verificationCode": verificationCode.value,
        "token": emailVerificationToken.value
    });
    if (result.ok) {
        password.value = '';
        state.overlay = 'account';
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
    if ((checkedUsername.value == newUsername && availableUsername.value != null) || newUsername.length < 2) {
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
