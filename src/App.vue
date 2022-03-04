<template>
  <div id="app">
    <home />
  </div>
</template>

<script>
import home from "./components/Home.vue";

export default {
  components: {
    home,
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
