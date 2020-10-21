
<template>

  <Carousel class="Carousel"
    v-model:activeItemIndex="active"
    :snap="true"
    :animate="true"
  
    v-slot="{
      animationValues,
      interpolate,
      activeItem,
    }"
  >
    <div v-for="(img, i) in images"
      class="image"
      :class="{active: activeItem && activeItem.dataset.imgtitle === img.title}"

      :data-imgtitle="img.title"

      :style="{
        transform: `scale(${
          interpolate(animationValues[i], 1, .5)
        })`
      }"
    >
      <img
        width="250px"
        height="250px"
        :src="img.src"
        :alt="img.title"
      >
      <h6>{{ img.title }}</h6>
    </div>
  </Carousel>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Carousel from '@/vue3-carousel.vue'

export default defineComponent({
  name: 'ServeDev',
  components: {
    Carousel,
  },
  data() {
    return {
      active: 2,
      
      images: [
        {
          src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
          title: "Green Mountain",
        },
        {
          src: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
          title: "Dark Mountain",
        },
        {
          src: "https://images.unsplash.com/photo-1516655855035-d5215bcb5604?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
          title: "Mountain Reflection",
        },
        {
          src: "https://images.unsplash.com/photo-1519405530001-3b5e82ba4dac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=925&q=80",
          title: "White Mountains",
        },
        {
          src: "https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
          title: "Street Mountain",
        },
        {
          src: "https://images.unsplash.com/photo-1452621946466-c0f2ff2ff100?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80",
          title: "Trees Mountain",
        },
        {
          src: "https://images.unsplash.com/photo-1489493512598-d08130f49bea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1048&q=80",
          title: "Sun Mountain",
        },
      ],
    }
  },
});
</script>

<style>

.image {
  position: relative;
  margin: 50px 1px;
  width: 250px;
  height: 250px;
  border-radius: 50000px;
  overflow: hidden;
  will-change: transform;
}

.image:first-child {
  margin-left: 175px;
}

.image:last-child {
  margin-right: 175px;
}

img, h6 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

img {
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: brightness(1);
}

h6 {
  margin: auto;
  transition-duration: .2s;
  opacity: 0;
  white-space: nowrap;
  font-family: Roboto;
  font-size: 20px;
  color: white;
}

.active h6 {
  opacity: 1;
}

.active img {
  filter: brightness(.5);
}

.image + .image {
  margin-left: 15px;
}

</style>

