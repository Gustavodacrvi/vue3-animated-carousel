
# vue3-animated-carousel

## TABLE OF CONTENTS
* [Introduction](#introduction)
* [Getting Started](#getting-started)
* [v-models](#v-models)
* [v-models Initial Mount Precedence](#v-models-precedence)
* [Props](#props)
* [Methods and Slot Props](#methods-and-slot-props)
  * [Before/After Slots](#before-after-slots)
  * [Component Refs/Slot Props](#refs)
  * [Methods](#refs)
* [Events](#events)
* [Animations](#animations)
* [Use Cases](#use-cases)
* ["scroll-snap-align" Animation Issue](#animation-issue)
* [Examples](#examples)
  * [Animations Example](#animation-example)
  * [Navigation And Slots Example](#navigation-and-slots-example)

## Getting Started

```
  # npm
  npm install vue3-animated-carousel

  # yarn
  yarn add vue3-animated-carousel
```

Then you can use on your component:

```
...
import Vue3AnimatedCarousel from "vue3-animated-carousel"
...
components: {
  Vue3AnimatedCarousel,
}
...
```

or

```
...
import { plugin } from "vue3-animated-carousel"
...
Vue.use(plugin)
...
```

## Introduction

This module aims to provide the tools for creating carousels with Vue 3 Composition API, this module does not provide the animations, the CSS themes for the navigation, or the items themselves, since they highly depend on your implementation, it will be a good idea to wrap this component on your own component with your styles and use it throughout the site.

This module uses mostly modern solutions, if you need to support super old browsers you might need to use something else.

## v-models

| Property      | Default | Type | Description          |
| ------------- |:-------------:|:-------------:|:-------------|
| modelValue      | 0 | number | Active page. The "active pages" are calculated by dividing the **scrollWidth/scrollHeight** by the **offsetWidth/offsetHeight**, it's useful for carousels that shows multiples items at time. See [Use Cases](#use-cases). |
| activeItem      | null | Element or null | The closest item at the center of the page, changing this prop focuses on the given item. |
| activeItemIndex       | 0 | number | The index of the active item(childNode), changing this prop focuses on the item at the specified index. |
| position       | 0 | number | Current scroll position, changing this prop updates the scroll position. Uses **scrollTop** when the **direction** is vertical and **scrollLeft** when it's horizontal.  |

## v-models Initial Mount Precedence

The initial mount precedence from higher to lower is "modelValue", "activeItemIndex", "activeItem" and "position", that means if the initial **activeItemIndex** value is 3, the carousel would focus on the fourth item, however, if the initial value of **modelValue** is also 2, then the carousel will "ignore" **activeItemIndex** and go to the second page instead because modelValue has higher precedence.

## Props

| Property      | Default | Type | Description          |
| ------------- |:-------------:|:-------------:|:-------------|
| direction      | "horizontal" | "horizontal" or "vertical" | Direction of the carousel. |
| useFlexBox      | true | boolean | Enables or disables the flexbox of the carousel. |
| scrollBehavior   | "smooth" | "auto" or "smooth" | Enables native smooth scrolling. |
| animate   | false | boolean | Enables animation, this can cause performance issues if not used properly, see [Animations](#animations). |
| hideScroll   | true | boolean | Hide carousel scroll. |
| snap | false | boolean | Enables javascript scroll snapping, the native **scroll-snap-align** CSS currently doesn't work well with **animate**, on those situations you'll want to use this prop. see ["scroll-snap-align" Animation Issue](#animation-issue). |
| scrollSnapType | "both mandatory" | [scroll-snap-type](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) | Behavior of the **scroll-snap-type** CSS property. |
| mouseDrag | false | boolean | Enables the user to move the carousel using the mouse. |

## Methods and Slot Props

You can access **all** of the methods/refs below using a component ref or using slot props. See [Examples](#examples).

```
  <Carousel v-slot="{nextItem, previousItem}">
    // items
  </Carousel>
```

or

```
...
  <Carousel ref="carousel">
    // items
  </Carousel>
...

// Options API
this.$refts.carousel.nextItem()
this.$refts.carousel.previousItem()

// Composition API
carousel.value.nextItem()
carousel.value.previousItem()

```

### Before/After Slots

You can use the **before**, **after** slots to add the carousel navigation, and still be able to use the default slot props.

### Component Refs/Slot Props

| Ref | Type | Description |
| ------------- |:-------------:|:-------------|
| carousel | Element | The carousel wrapper element.
| items | Element[] | Carousel items.
| scrollSize | number | The size of the scroll, it's the **scrollLeft** for horizontal carousels and **scrollTop** for the vertical ones.
| clientSize | number | The visible part of the carousel, it's the **offsetWidth** for horizontal carousels and **offsetHeight** for the vertical ones.
| numberOfPages | number | Number of pages on the carousel.
| active | number | Active page index.
| activeItem | Element | Closest element at the center of the viewport.
| activeItemIndex | Element | The index of the active item(childNode).
| isDragging | boolean | Is true when the user is dragging the carousel using the mouse, will always be false when **mouseDrag** is false.
| isSnapping | boolean | Is true when the carousel is snapping, will always be false when **snap** is false.
| interpolate | (value: number or undefined, center: number, side: number) => number | Helper function to interpolate animation values. see [Animations](#animations).
| rects | Array<{node: Element, rect: DOMRect}> | It's an array containing all the DOMRects of every single element on the list, this ref will only be updated once after scrolling when **animate** is false, see [Animations](#animations).
| animationValues | number[] | Values used on the animations, will only be calculated once after scrolling when **animate** is false, see [Animations](#animations).

### Methods

| Method | Type | Description |
| ------------- |:-------------:|:-------------|
| runOnScrollEnd | (func: () => void) => void | Run function on the next "scroll-end" event. 
| saveDomRects | () => Array<{node: Element, rect: DOMRect}> | Calculates the data used for animation and returns it. 
| scrollTo | ({position: number, behavior?: string, force?: boolean}) => void | Sets the scrollLeft/scrollTop of the carousel. 
| nextItem | () => void | Focuses on the **next** sibling of the closest element at the center of the viewport. 
| previousItem | () => void | Focuses on the **previous** sibling of the closest element at the center of the viewport. 
| moveToItem | (element: Element) => void | Focuses on the given item.
| moveToItemAtIndex | (itemIndex: Element) => void | Focuses on the item at the specied index.
| focusOnClick | (evt: PointerEvent) => void | Helper function to focus on the item when clicked, **@click="focusOnClick**.
| moveToPage | (pageIndex: number) => void | Goes to the given "page" index calculated using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight).
| nextPage | () => void | Goes to the next "page" calculated using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight). 
| previousPage | () => void | Goes to the previous "page" calculated using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight). 

## Events

| Event  | Type inferface | Description |
| ------------- |:-------------:|:-------------|
| number-of-pages | number | Returns the number of pages.
| client-size | number | Returns the client size, it's the offsetWidth on horizontal carousels and offsetHeight on vertical ones.
| scroll-size | number | Returns the scroll size, it's the scrollLeft on horizontal carousels and scrollTop on vertical ones.
| rects | Array<{node: Element, rect: DOMRect}> | Returns an array containing all the DOMRects of every single element on the list, this ref will only be updated once after scrolling when **animate** is false, see [Animations](#animations).
| items | Element[] | Returns the carousel items.
| animation-values | number[] | Values used for animation, will only be calculated once after scrolling when **animate** is false, see [Animations](#animations).
| scroll-start | undefined | Fires when the carousel starts scrolling.
| scroll-end | undefined | Fires when the carousel stops scrolling.
| snap-start | undefined | Fires just before the snap occurs, never fires when **snap** is false.
| snap-end | undefined | Fires just after the snap, never fires when **snap** is false.
| mouse-drag-start | undefined | Fires when the user starts dragging the carousel using the mouse, never fires when **mouseDrag** is false.
| mouse-drag-end | undefined | Fires when the user stops dragging the carousel using the mouse, never fires when **mouseDrag** is false.

## Animations

By setting the **animate** prop to true, you will be able to use the **animationValues** to do animations, it's a list of numbers where each of them goes from -1 to 1. The closest the element is to the left side of the screen, the closer to -1 is its value, the closest the element is to the right side of the screen, the closer to 1 is its value. Then all you have to do is interpolate the values in your animations.

The list will update on the scroll event and will use **getBoundingClientRect** with **requestAnimationFrame** for EVERY single element of the list, which means your list will update A LOT, so don't forget to always use "transforms, opacity" and other properties that only cause a **repaint**, and to set the **will-change** CSS property to get a smooth effect. Also, the highest the number of childNodes, the less performant it will be, so be mindful when using these animations.

This module provides the **interpolate** function to make your life easier, but you can still create your own interpolations.

See [Animations Example](#animation-example).

## Use Cases

### Multiple Items At Once

On some carousels, especially on desktop ones, you might want to show multiples items at once, on those situations, the carousel "pages" aren't dependent on the items themselves but on the available size and on the scroll size, for example, a horizontal carousel with a 2400px of scroll width and with an available width of 800px will be divided into 3 "pages", going to the second page sets the scrollWidth to 1600px. Examples:

![Google Chrome Examples](http://github.com/Gustavodacrvi/vue3-animated-carousel/blob/images-bucket/images/google-chrome-carousel.gif?raw=true)

In this use case, you'll want to use the page related methods/refs: "modelValue", "nextPage", "previousPage", "numberOfPages", "moveToPage". You can still use all the other methods though.

### One Item At a Time/Item At The Center

Common on mobile devices and on image carousels, here you just want to show one item at a time or centralize the images item, this means the number of "pages" **might not** be equal to the number of items. Those items many times have margins and paddings, which may cause the numberOfPages to be different than the actual number of items, if that happens, the "page" like behavior carousel will simply not look good, if the image width/height is the same as the carousel offsetWidth/offsetHeight, you probably don't have to worry about this.

![One Item Carousel](http://github.com/Gustavodacrvi/vue3-animated-carousel/blob/images-bucket/images/images-carousel.gif?raw=true)

To prevent these problems, always use the item related methods/refs on these situations: "activeItem"(v-model:activeItem), "nextItem", "items", "previousItem", "moveToItem", "moveToItemAtIndex", "focusOnClick". Those methods will go to the items themselves instead of calculating the page using using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight).

### Responsive Carousel

Sometimes you want to show multiple items on desktop and one item at a time on smaller devices, you can then use the scrollSize and change the event handlers functions on the template.


## "scroll-snap-align" Animation Issue

If you're planning to use the CSS native **scroll-snap-align** property to snap your elements together with the **animate** for animations, you'll encounter some problems, the carousel lags a lot and just doesn't work, for now, use the **snap** prop to activate the javascript snapping feature.

If you won't use the animations, then you might as well just use the native implementation and disable the javascript snapping.

## Examples

### Animations Example

* [Examples](#examples)
  * [Animations Example](#animation-example)
  * [Navigation And Slots Example](#navigation-and-slots-example)

![Animaton Example](http://github.com/Gustavodacrvi/vue3-animated-carousel/blob/images-bucket/images/animation-example.gif?raw=true)

```
<template>
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

....

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

```

### Navigation And Slots Example

![Animaton Example](http://github.com/Gustavodacrvi/vue3-animated-carousel/blob/images-bucket/images/navigation-example.gif?raw=true)

```
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
```

```
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
```
