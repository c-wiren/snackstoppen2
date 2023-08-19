<script setup lang="ts">
import api from "@/lib/api";
const brands = await api.getBrands();
const snacks = await api.getSnacks();
</script>

<template>
  <div>
    <h1>Snacks</h1>
    <div>
      <RouterLink v-for="brand in brands" :key="brand.name" :to="'snacks/' + brand.id">{{
        brand?.name
      }}</RouterLink>
    </div>
    <div>
      <RouterLink
        v-for="snack in snacks"
        :key="snack.name"
        :to="'snacks/' + snack.brand?.id + '/' + snack.slug"
        >{{ snack.brand?.name }} -
        {{ snack.name }}
      </RouterLink>
    </div>
  </div>
</template>
