<template>
  <NuxtLayout>
    <header class="fixed flex w-screen justify-center gap-4 bg-white p-4 font-bold">
      <RouterLink to="/" class="mr-4 uppercase">Snackstoppen</RouterLink>
      <RouterLink to="/">Hem</RouterLink>
      <RouterLink to="/snacks">Snacks</RouterLink>
      <RouterLink to="/toppen">Toppen</RouterLink>
      <RouterLink to="/om-sidan">Om sidan</RouterLink>
    </header>
    <NuxtPage class="grid min-h-screen place-content-center" />
  </NuxtLayout>
</template>
<style scoped lang="pcss">
a {
  @apply text-black no-underline;
}
</style>
