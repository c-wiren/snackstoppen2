<script setup lang="ts">
import api from "@/lib/api";
const route = useRoute();
const brand = await api.getBrand(route.params.brand as string);
const snacks = await api.getSnacks({ brand: route.params.brand as string });
</script>

<template>
  <div>
    <img :src="brand.image?.lg" class="w-32" />
    <h1>{{ brand?.name }}</h1>
    <NuxtLink v-for="snack in snacks" :key="snack.name" :to="snack.brand?.id + '/' + snack.slug">{{ snack.brand?.name }}
      - {{ snack.name }}
    </NuxtLink>
  </div>
</template>
