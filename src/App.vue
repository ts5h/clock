<template>
  <ReturnToTop theme="light" />
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReturnToTop from '@/components/ReturnToTop.vue';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  components: {
    ReturnToTop,
    HelloWorld,
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
