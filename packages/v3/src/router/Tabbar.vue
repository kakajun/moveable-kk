<template>
  <div class="wrapper">
    <router-link to="/">master</router-link>
    <router-link to="/SelectoGroup">SelectoGroup</router-link>
    <router-link to="/SelectoMany">SelectoMany</router-link>
    <router-link to="/Selecto-many-select">SelectoSelectMany</router-link>
    <router-link to="/SelectoSelect">SelectoSelect</router-link>
    <router-link to="/VueInfiniteViewer">VueInfiniteViewer</router-link>
    <router-link to="/context-menu">context-menu</router-link>
  </div>

</template>
<script setup>
</script>
<style  scoped>
div {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  z-index: 999999;
  display: flex;
  justify-content: space-around;
}
</style>
