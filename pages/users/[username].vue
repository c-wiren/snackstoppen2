<script setup lang="ts">
import api, { asyncRef } from "@/lib/api";
const route = useRoute();
const username = route.params.username as string;
const user = await api.getUser(username);
if (!user) { throw createError({ statusCode: 404 }); }
const reviews = asyncRef(() => api.getReviews({ username }));
</script>

<template>
  <div>
    <h1>{{ user.username }}</h1>
    <h2>Reviews</h2>
    {{ reviews }}
  </div>
</template>
