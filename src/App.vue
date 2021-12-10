<template>
  <ReturnToHome theme="light" />
  <Clock />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReturnToHome from '@/components/ReturnToHome.vue';
import Clock from '@/components/Clock.vue';

export default defineComponent({
  name: 'App',
  components: {
    ReturnToHome,
    Clock,
  },
});
</script>

<style lang="scss">
@use "scss/config/variables";

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
