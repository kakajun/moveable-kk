<template>
    测试页面
    <Tabbar></Tabbar>
    <h1>img SVG本地图片:</h1>
    <svg-icon icon-class="ContextmenuBottom" />
    <svg-icon icon-class="ContextmenuCopy" color="red" />
    <router-view></router-view>
  </template>
  <script setup>
  import Tabbar from './router/Tabbar.vue';

  </script>
  <style scoped>
  </style>
