<script setup lang="ts">
import api from "@/lib/api";
const route = useRoute();
const snack = await api.getSnack(route.params.brand.toString(), route.params.slug.toString());
const reviews = await api.getSnackReviews(route.params.brand.toString(), route.params.slug.toString());
</script>

<template>
  <h1>{{ snack?.name }}</h1>
  <div v-for="review in reviews">
    <router-link :to="'/users/' + review.user?.username">{{ review.user?.username }}</router-link>
    {{ (review?.rating ?? 0) / 2 }}
    <br />
    {{ review.review }}
  </div>
</template>
