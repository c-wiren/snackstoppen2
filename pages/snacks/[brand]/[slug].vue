<script setup lang="ts">
import api from "@/lib/api";
const route = useRoute();
const snack = await api.getSnack(route.params.brand as string, route.params.slug as string);
const reviews = await api.getSnackReviews(
  route.params.brand as string,
  route.params.slug as string
);
</script>

<template>
  <div>
    <img :src="snack.image?.lg" class="w-64" />
    <h1>{{ snack?.name }}</h1>
    <div v-for="review in reviews" :key="review.id">
      <NuxtLink :to="'/users/' + review.user?.username">{{ review.user?.username }}</NuxtLink>
      {{ (review?.rating ?? 0) / 2 }}
      <br />
      {{ review.review }}
    </div>
  </div>
</template>
