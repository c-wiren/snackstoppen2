<script setup lang="ts">
import api from "@/lib/api";
const brands = await api.getBrands();
const snacks = await api.getSnacks();
</script>

<template>
  <h1>Snacks</h1>
  <div>
    <routerLink v-for="brand in brands" :to="'snacks/' + brand.id">{{ brand?.name }}</routerLink>
  </div>
  <div>
    <routerLink v-for="snack in snacks" :to="'snacks/' + snack.brand?.id + '/' + snack.slug"
      >{{ snack.brand?.name }} -
      {{ snack.name }}
    </routerLink>
  </div>
</template>
