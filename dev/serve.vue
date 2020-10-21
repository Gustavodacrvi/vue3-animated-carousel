<script lang="ts">
import { defineComponent } from 'vue';
import Vue3Carousel from '@/vue3-carousel.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Vue3Carousel
  }
});
</script>

<template>
  <div id="app">
    <vue3-carousel />
  </div>
</template>
