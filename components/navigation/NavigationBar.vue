<template>
  <div class="fixed top-0 z-20 mt-0 flex w-screen justify-center">
    <header
      class="w-full bg-gradient-to-tr from-blue-700 to-blue-400 p-3 text-white shadow-lg shadow-blue-400/25 md:m-6 md:max-w-4xl md:rounded-xl"
    >
      <div class="flex items-center justify-between">
        <!-- LEFT SIDE -->
        <div class="flex flex-1 items-center">
          <!-- DESKTOP LOGO -->
          <NuxtLink to="/">
            <div
              class="ml-2 mr-6 hidden select-none font-semibold uppercase tracking-widest md:block"
            >
              Snackstoppen
            </div>
          </NuxtLink>
          <!-- Removed  -->
          <MenuButton class="cursor-pointer md:hidden" :active="isOpen" @click="isOpen = !isOpen" />
        </div>
        <!-- DESKTOP -->
        <nav
          class="hidden justify-center font-mono font-bold uppercase tracking-widest md:flex md:space-x-6"
        >
          <NuxtLink
            v-for="item in nav"
            :key="item.name"
            :to="item.to"
            class="rounded px-2 py-1 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-40"
            >{{ item.name }}</NuxtLink
          >
        </nav>
        <!-- MOBILE LOGO -->
        <NuxtLink to="/">
          <div class="select-none font-semibold uppercase tracking-widest md:hidden">
            Snackstoppen
          </div>
        </NuxtLink>
        <!-- RIGHT SIDE -->
        <div class="ml-4 flex flex-1 items-center justify-end gap-2">
          <button
            class="rounded-md p-1 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-40"
            @click="$root.overlay = 'search'"
          >
            <MagnifyingGlassIcon class="h-6 w-6" />
          </button>
          <!-- USER -->
          <template v-if="$root.user">
            <button
              class="rounded-md p-1 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-40 md:px-2"
              @click="$root.overlay = 'account'"
            >
              <span class="mr-1 hidden align-middle font-semibold tracking-wider lg:inline-block">{{
                $root.user.username
              }}</span>
              <UserCircleIcon class="inline-block h-6 w-6 align-middle" />
            </button>
          </template>
          <template v-else>
            <button
              class="hidden h-full rounded-lg bg-blue-300 px-2 py-1 font-bold uppercase tracking-widest text-blue-700 transition hover:bg-opacity-75 md:block"
              @click="$root.overlay = 'login'"
            >
              Logga in
            </button>
            <button
              class="rounded-md p-1 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-40 md:hidden"
              @click="$root.overlay = 'login'"
            >
              <UserCircleIcon class="block h-6 w-6" />
            </button>
          </template>
        </div>
      </div>
      <!-- MOBILE -->
      <nav
        v-show="isOpen"
        ref="mobile-nav"
        class="flex h-screen flex-col justify-center gap-2 pb-44 md:hidden"
      >
        <NuxtLink
          v-for="item in nav"
          :key="item.name"
          :to="item.to"
          class="block rounded-md px-2 py-2 text-center font-mono text-3xl font-bold uppercase tracking-widest text-white active:bg-white active:bg-opacity-20"
          >{{ item.name }}</NuxtLink
        >
      </nav>
    </header>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/vue/20/solid";

const isOpen = ref(false);
const route = useRoute();

const nav = [
  { name: "Hem", to: "/" },
  { name: "Snacks", to: { name: "snacks" } },
  { name: "Toppen", to: { name: "toppen" } },
  { name: "Om sidan", to: { name: "om-sidan" } },
];

// Close mobile menu on route change
watch(
  () => route.name,
  () => {
    isOpen.value = false;
  }
);
</script>
