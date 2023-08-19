<script setup lang="ts">
import api from "@/lib/api";
const route = useRoute();
const user = await api.getUser(route.params.username.toString());
const reviews = await api.getUserReviews(route.params.username.toString());
</script>

<template>
  <div>
    <h1>{{ user?.username }}</h1>
    {{ user }}
    <h2>Reviews</h2>
    {{ reviews }}
  </div>
</template>
