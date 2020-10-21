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

  <div class="carousel">
    <Carousel>
      <template v-slot:default>
        <div v-for="img in images"
          :key="img.title"
          class="item"
        >
          <img :src="img.src" :alt="img.title">
        </div>
      </template>

      <template v-slot:after="{activeItemIndex, moveToItemAtIndex, items, nextItem, previousItem}">
        <span class="dot left" @click="previousItem">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="dot right" @click="nextItem">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        </span>
        
        <span class="dot-wrapper">
          <span v-for="num in items.length"
            class="dot"
            :class="{active: activeItemIndex === (num - 1)}"
            :key="num"

            @click="moveToItemAtIndex(num - 1)"
          >{{ num }}</span>
        </span>
      </template>
    </Carousel>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

import Carousel from "./Carousel.vue"

export default defineComponent({
  inheritAttrs: false,
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


body {
  font-family: Roboto;
}

.carousel {
  position: relative;
}

.dot-wrapper {
  z-index: 2;
  position: absolute;
  bottom: 30px;
  width: 100%;
  pointer-events: none;
  display: flex;
}

.dot, .dot-wrapper {
  justify-content: center;
  align-items: center;
}

.dot {
  pointer-events: all;
  color: white;
  border-radius: 10000px;
  background-color: rgba(0,0,0,.3);
  border: 2px solid white;
  width: 30px;
  font-size: 16px;
  height: 30px;
  font-family: Roboto;
  display: inline-flex;
  transition-duration: .15s;
}

.left, .right {
  position: absolute;
  display: block;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
}

.right {
  left: unset;
  right: 8px;
}

.dot:active, .active {
  background-color: white;
  color: black;
}

.dot + .dot {
  margin-left: 10px;
}

.item {
  position: relative;
  height: 400px;
  width: 100vw;
  scroll-snap-align: center;
}

img {
  width: 100%;
  object-fit: cover;
  height: 100%;
}

</style>
