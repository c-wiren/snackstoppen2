<script setup lang="ts">
import api from "@/lib/api";
const route = useRoute();
const brand = await api.getBrand(route.params.brand.toString());
const snacks = await api.getSnacks();
</script>

<template>
  <h1>{{ brand?.name }}</h1>
  <div>
    <routerLink v-for="snack in snacks" :to="snack.brand?.id + '/' + snack.slug">{{ snack.brand?.name }} - {{ snack.name }} </routerLink>
  </div>
</template>
