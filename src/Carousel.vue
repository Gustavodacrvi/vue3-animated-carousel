<template>
  <slot name="before"
    :carousel="carousel"
    :activeItem="activeItem"
    :activeItemIndex="activeItemIndex"
    :position="position"
    :scrollSize="scrollSize"
    :clientSize="clientSize"
    :rects="rects"
    :items="items"
    :saveDomRects="saveDomRects"
    :active="active"
    :numberOfPages="numberOfPages"
    :scrollTo="scrollTo"
    :runOnScrollEnd="runOnScrollEnd"
    :moveToItem="moveToItem"
    :nextItem="nextItem"
    :previousItem="previousItem"
    :getClosestItemAtTheCenter="getClosestItemAtTheCenter"
    :focusOnClick="focusOnClick"
    :moveToItemAtIndex="moveToItemAtIndex"
    :animationValues="animationValues"
    :interpolate="interpolate"
    :isSnapping="isSnapping"
    :isDragging="isDragging"
  ></slot>
  <div
    class="Carousel"
    ref="carousel"
    :class="{useFlexBox, scrollBehavior, hideScroll}"
    :style="{
      scrollBehavior: isDragging ? '' : scrollBehavior,
      scrollSnapType,
    }"
    v-bind="$attrs"
  >
    <slot
      :carousel="carousel"
      :activeItem="activeItem"
      :activeItemIndex="activeItemIndex"
      :position="position"
      :scrollSize="scrollSize"
      :clientSize="clientSize"
      :rects="rects"
      :items="items"
      :saveDomRects="saveDomRects"
      :active="active"
      :numberOfPages="numberOfPages"
      :scrollTo="scrollTo"
      :runOnScrollEnd="runOnScrollEnd"
      :moveToItem="moveToItem"
      :nextItem="nextItem"
      :previousItem="previousItem"
      :getClosestItemAtTheCenter="getClosestItemAtTheCenter"
      :focusOnClick="focusOnClick"
      :moveToItemAtIndex="moveToItemAtIndex"
      :animationValues="animationValues"
      :interpolate="interpolate"
      :isSnapping="isSnapping"
      :isDragging="isDragging"
    ></slot>
  </div>
  <slot name="after"
    :carousel="carousel"
    :activeItem="activeItem"
    :activeItemIndex="activeItemIndex"
    :position="position"
    :scrollSize="scrollSize"
    :clientSize="clientSize"
    :rects="rects"
    :items="items"
    :saveDomRects="saveDomRects"
    :active="active"
    :numberOfPages="numberOfPages"
    :scrollTo="scrollTo"
    :runOnScrollEnd="runOnScrollEnd"
    :moveToItem="moveToItem"
    :nextItem="nextItem"
    :previousItem="previousItem"
    :getClosestItemAtTheCenter="getClosestItemAtTheCenter"
    :focusOnClick="focusOnClick"
    :moveToItemAtIndex="moveToItemAtIndex"
    :animationValues="animationValues"
    :interpolate="interpolate"
    :isSnapping="isSnapping"
    :isDragging="isDragging"
  ></slot>
</template>

<script lang="ts">

import { defineComponent, onMounted, onUnmounted, nextTick, ref, toRefs, watch, computed, Ref, onBeforeUnmount, Events, PropType, Prop, watchEffect, unref, onUpdated, onRenderTriggered, reactive, onBeforeUpdate } from 'vue'

import dimensionsFeature from "./composables/dimensions"
import pagesFeature from "./composables/pages"
import scrollerFeature from "./composables/scroller"
import positionFeature from "./composables/position"
import itemsFeature from "./composables/items"
import animationFeature from "./composables/animation"
import snapFeature from "./composables/snap"
import mouseFeature from "./composables/mousedrag"

export default defineComponent({
  emits: [
    "number-of-pages",
    "client-size",
    "scroll-size",
    "rects",
    "items",

    "mouse-drag-start",
    "mouse-drag-end",
    "scroll-start",
    "scroll-end",
    "snap-start",
    "snap-end",
    
    "animation-values",

    "update:modelValue",
    "update:activeItem",
    "update:activeItemIndex",
    "update:position",
  ],
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    position: {
      type: Number,
      default: 0,
    },
    activeItem: {
      type: Object as PropType<Element>,
      default: null,
    },
    activeItemIndex: {
      type: Object as PropType<number>,
      default: 0,
    },
    direction: {
      type: String as PropType<"horizontal" | "vertical">,
      default: "horizontal",
    },

    useFlexBox: {
      type: Boolean,
      default: true,
    },
    scrollBehavior: {
      type: String,
      default: "smooth",
    },
    scrollSnapType: {
      type: String,
      default: "both mandatory",
    },
    animate: {
      type: Boolean,
      default: false,
    },
    hideScroll: {
      type: Boolean,
      default: true,
    },
    snap: {
      type: Boolean,
      default: false,
    },
    mouseDrag: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const {
      modelValue,
      scrollBehavior,
      position: propPosition,
      activeItem: propActiveItem,
      activeItemIndex: propActiveItemIndex,
      snap,
      mouseDrag,
      animate,
    } = toRefs(props)

    const carousel = ref(null as unknown as HTMLElement)
    const isHorizontal = computed(() => props.direction === "horizontal")


    const {scrollTo, runOnScrollEnd} = scrollerFeature({carousel, isHorizontal, scrollBehavior}, context)

    const {
      position,
      scrollSize,
      clientSize,
      rects,
      items,

      saveDomRects,
    } = dimensionsFeature({isHorizontal, carousel}, context)

    const {active, numberOfPages} = pagesFeature({
      clientSize, modelValue,
      scrollTo, position, scrollSize,
    }, context)

    positionFeature({propPosition, scrollTo})

    const {
      activeItem,
      activeItemIndex,
      
      moveToItem,
      nextItem,
      previousItem,
      moveToItemAtIndex,
      focusOnClick,
      getClosestItemAtTheCenter,
    } = itemsFeature({
      scrollTo, position, rects, saveDomRects, isHorizontal,
      clientSize, items, runOnScrollEnd, propActiveItem, propActiveItemIndex,
    }, context)

    const {
      animationValues,
      interpolate,
    } = animationFeature({
      items, animate, carousel,
      rects, clientSize, isHorizontal,
      saveDomRects, getClosestItemAtTheCenter,
    }, context)

    const {
      isSnapping,
    } = snapFeature({
      getClosestItemAtTheCenter, moveToItem, carousel,
      runOnScrollEnd, snap,
    }, context)

    const {
      isDragging,
    } = mouseFeature({
      carousel, scrollTo, position, isHorizontal,
      mouseDrag,
    }, context)

    return {
      carousel,
      activeItem,
      activeItemIndex,

      position,
      scrollSize,
      clientSize,
      rects,
      items,
      saveDomRects,
      
      active,
      numberOfPages,

      scrollTo,
      runOnScrollEnd,

      moveToItem,
      nextItem,
      previousItem,
      getClosestItemAtTheCenter,
      focusOnClick,
      moveToItemAtIndex,

      animationValues,
      interpolate,

      isSnapping,

      isDragging,
    }
  }, 
})

</script>

<style>

.Carousel.useFlexBox > div {
  flex: 0 0 auto;
}

</style>

<style scoped>

.Carousel {
  overflow: auto;
}

.Carousel.useFlexBox {
  display: flex;
  flex-wrap: nowrap;
}

.smooth {
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}

.hideScroll::-webkit-scrollbar {
  display: none;
  height: 0;
  width: 0;
}

</style>
