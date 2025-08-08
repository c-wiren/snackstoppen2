<script setup lang="ts">
import api from "@/lib/api";
const snacks = await api.getSnacks({ order: 'Rating' });
</script>

<template>
  <div>
    <h1>Toppen</h1>
    <NuxtLink v-for="(snack, i) in snacks" :key="snack.name" :to="'snacks/' + snack.brand?.id + '/' + snack.slug">
      <img :src="snack.image?.lg" class="w-32" />
      {{ i + 1 }}.
      {{
        snack.brand?.name }} -
      {{ snack.name }}
    </NuxtLink>
  </div>
</template>
