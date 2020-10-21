<template>
  <button @click="next">Next item</button>
  <button @click="previous">Previous item</button>
  <button @click="active++">Next page</button>
  <button @click="active--">Previous page</button>

  <button @click="position = 1000">Go to position 1000</button>
  <button @click="position = 300">Go to position 300</button>
  <button @click="position = 1000000">Go to position 1000000</button>
  
  <button @click="toggleDirection">Toggle direction ({{direction}})</button>
  <button @click="snap = !snap">Toggle snap ({{snap}})</button>
  <button @click="mouseDrag = !mouseDrag">Toggle mouse drag ({{mouseDrag}})</button>
  <button @click="animate = !animate">Toggle animation ({{animate}})</button>

  Number of pages: {{ numberOfPages }}
  Active: {{ active }}
  Position: {{ position }}
  Item: {{ item && item.id }}

  Client size: {{ clientSize }}
  Scroll Size: {{ scrollSize }}
  isPressing: {{ isPressing }}
  Scrolling: {{ scrolling }}

  Is Snapping: {{ isSnapping }}
  Is Dragging: {{ isDragging }}

<!--   Rects: {{ rects }}
  Animation values: {{ animationValues }} -->

  <Carousel class="Carousel"
    :snap="true"
    :animate="true"
  
    v-slot="{
      animationValues,
      interpolate,
      activeItem,
    }"
  >
    <div v-for="(img, i) in images"
      :key="img.title"
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

import Carousel from "./Carousel.vue"

export default defineComponent({
  name: 'App',
  components: {
    Carousel,
  },
  data() {
    return {
      active: 0,
      clientSize: 0,
      isDragging: 0,
      scrollSize: 0,
      rects: [],
      animationValues: [],
      position: 0,
      numberOfPages: 0,
      scrolling: false,
      isSnapping: false,
      isPressing: false,
      animate: false,
      item: null,
      snap: false,
      mouseDrag: false,
      values: 0,
      direction: "horizontal",

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
      
      items: [
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "What is Lorem Ipsum?",
          descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
      ],
    }
  },
  methods: {
    next() {
      (this.$refs.carousel as any).nextItem()
    },
    previous() {
      (this.$refs.carousel as any).previousItem()
    },
    
    toggleDirection() {
      if (this.direction === "horizontal") {
        this.direction = "vertical"
      } else {
        this.direction = "horizontal"
      }
    },
  },
})

</script>

<style>

body {
  margin: 0;
}

</style>

<style scoped>


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
  margin-left: 175px;
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




.Carousel {
  margin-top: 1000px;
}

.item {
  width: 250px;
  flex-shrink: 0;
  border-radius: 8px;
  padding: 12px;
  user-select: none;
  margin: 10px;
  border: 2px solid lightgray;
  will-change: transform;
}

.item:first-child {
  margin-left: 20px;
}

.item:last-child {
  margin-right: 100px;
}

.vertical {
  height: 700px;
  flex-direction: column;
}

.vertical .item {
  max-height: 200px;
  overflow: hidden;
}

h3 {
  margin: 0;
}

</style>
