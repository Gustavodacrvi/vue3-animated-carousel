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

import { defineComponent, ref, toRefs, computed, PropType } from 'vue'

import dimensionsFeature from "./composables/dimensions.ts"
import pagesFeature from "./composables/pages.ts"
import scrollerFeature from "./composables/scroller.ts"
import positionFeature from "./composables/position.ts"
import itemsFeature from "./composables/items.ts"
import animationFeature from "./composables/animation.ts"
import snapFeature from "./composables/snap.ts"
import mouseFeature from "./composables/mousedrag.ts"
import vModelsSnapFeature from "./composables/vModelsSnap.ts"

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
      type: Number as PropType<number>,
      default: 0,
    },
    position: {
      type: Number as PropType<number>,
      default: 0,
    },
    activeItem: {
      type: Object as PropType<Element>,
      default: null,
    },
    activeItemIndex: {
      type: Number as PropType<number>,
      default: 0,
    },
    direction: {
      type: String as PropType<"horizontal" | "vertical">,
      default: "horizontal",
    },

    useFlexBox: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    scrollBehavior: {
      type: String as PropType<string>,
      default: "smooth",
    },
    scrollSnapType: {
      type: String as PropType<string>,
      default: "both mandatory",
    },
    animate: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    hideScroll: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    snap: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    mouseDrag: {
      type: Boolean as PropType<boolean>,
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

    const {initialSnap} = vModelsSnapFeature({modelValue, propActiveItemIndex, propActiveItem, propPosition})

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
      clientSize, modelValue, initialSnap,
      scrollTo, position, scrollSize,
    }, context)

    positionFeature({propPosition, scrollTo, initialSnap})

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
      scrollTo, position, rects, saveDomRects, isHorizontal, initialSnap,
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
      runOnScrollEnd, snap, initialSnap,
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
