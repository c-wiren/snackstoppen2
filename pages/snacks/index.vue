<script setup lang="ts">
import api from "@/lib/api";
const brands = await api.getBrands();
const snacks = await api.getSnacks();
</script>

<template>
  <div>
    <h1>Snacks</h1>
    <div>
      <NuxtLink v-for="brand in brands" :key="brand.name" :to="'snacks/' + brand.id">
        <img :src="brand.image?.lg" class="w-32" />
        {{
          brand?.name
        }}
      </NuxtLink>
    </div>
    <div>
      <NuxtLink v-for="snack in snacks" :key="snack.name" :to="'snacks/' + snack.brand?.id + '/' + snack.slug">
        <img :src="snack.image?.lg" class="w-32" />
        {{
          snack.brand?.name }} -
        {{ snack.name }}
      </NuxtLink>
    </div>
  </div>
</template>
