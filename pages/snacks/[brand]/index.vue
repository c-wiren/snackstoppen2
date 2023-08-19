<script setup lang="ts">
import api from "@/lib/api";
const route = useRoute();
const brand = await api.getBrand(route.params.brand.toString());
const snacks = await api.getSnacks();
</script>

<template>
  <div>
    <h1>{{ brand?.name }}</h1>
    <RouterLink v-for="snack in snacks" :key="snack.name" :to="snack.brand?.id + '/' + snack.slug"
      >{{ snack.brand?.name }} - {{ snack.name }}
    </RouterLink>
  </div>
</template>
