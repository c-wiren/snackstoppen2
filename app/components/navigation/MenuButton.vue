<template>
  <div class="menu-button" :class="{ active }">
    <span class="menu-button bar top"></span>
    <span class="menu-button bar middle"></span>
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
  margin-left: 4px;
  width: 24px;
  height: 24px;
  position: relative;
}
.menu-button .bar {
  height: 2.5px;
  width: 100%;
  border-radius: 1.25px;
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
  top: 4px;
}

.menu-button .middle {
  top: 11px;
}

.menu-button .bottom {
  top: 18px;
}

.menu-button.active .top {
  transform: rotate(45deg);
  top: 11px;
}

.menu-button.active .middle {
  opacity: 0;
}

.menu-button.active .bottom {
  transform: rotate(-45deg);
  top: 11px;
}
</style>
