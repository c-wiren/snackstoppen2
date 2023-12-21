<template>
  <div class="menu-button" :class="{ active }">
    <span class="menu-button bar top"></span>
    <span class="menu-button bar bottom"></span>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.menu-button {
  width: 24px;
  height: 24px;
  position: relative;
}
.menu-button .bar {
  height: 2px;
  width: 100%;
  position: absolute;
  background-color: white;
  transition:
    top 0.1s 0.11s,
    transform 0.2s;
}
.menu-button.active .bar {
  transition:
    top 0.1s,
    transform 0.2s 0.05s;
}
.menu-button .top {
  top: 8px;
}
.menu-button .bottom {
  top: 14px;
}

.menu-button.active .top {
  transform: rotate(45deg);
  top: 10px;
}
.menu-button.active .bottom {
  transform: rotate(-45deg);
  top: 10px;
}
</style>
