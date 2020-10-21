
# vue3-carousel

## TABLE OF CONTENTS
* [Introduction](#introduction)
* [v-models](#v-models)
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
 * [Animations](#examples)

## Introduction

This module aims to provide the tools for creating carousels with Vue 3 Composition API, this module does not provide the animations, the CSS themes for the navigation or the items themselves, since they highly depend on your implementation, it will be good idea to wrap this component on your own component with your styles and use it throughout the site.

This module uses mostly modern solutions, if you need to support super old browsers you might need to use something else.

## v-models

| Property      | Default | Description          |
| ------------- |:-------------:|:-------------|
| modelValue      | 0 | Active page. The "active pages" are calculated by dividing the **scrollWidth/scrollHeight** by the **offsetWidth/offsetHeight**, it's useful for carousels that shows multiples items at time. See [Use Cases](#use-cases) |
| activeItem      | null | The closest item at the center of the page, changing this prop focuses on the given item. |
| position       | 0 | Current scroll position, changing this prop updates the scroll position. Uses **scrollTop** when the **direction** is vertical and **scrollLeft** when it's horizontal.  |


## Props

| Property      | Default | Type | Description          |
| ------------- |:-------------:|:-------------:|:-------------|
| direction      | "horizontal" | "horizontal" or "vertical" | Direction of the carousel. |
| useFlexBox      | true | boolean | Enables or disables the flexbox of the carousel. |
| scrollBehavior   | "smooth" | "auto" or "smooth" | Enables native smooth scrolling. |
| animate   | false | boolean | Enables animation, this can cause performance issues if not used properly, see [Animations](#animations). |
| hideScroll   | true | boolean | Hide carousel scroll. |
| snap | false | boolean | Enables javascript scroll snapping, the native **scroll-snap-align** css currently doesn't work well with **animate**, on those situations you'll want to use this prop. see ["scroll-snap-align" Animation Issue](#animation-issue). |
| scrollSnapType | "both mandatory" | [scroll-snap-type](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) | Behavior of the **scroll-snap-type** css property. |
| mouseDrag | false | boolean | Enables the user to move the carousel using mouse. |

## Methods and Slot Props

You can access **all** of the methods/refs below using a component ref or using slot props. See [Examples](#examples)

### Before/After Slots

You can use the **before**, **after** slots to add the carousel navigation and still be able to use the default slot props.

### Component Refs/Slot Props

| Ref | Type | Description |
| ------------- |:-------------:|:-------------|
| carousel | Element | The carousel wrapper element.
| scrollSize | number | The size of the scroll, is the **scrollLeft** for horizontal carousels and **scrollTop** for the vertical ones.
| clientSize | number | The visible part carousel, is the **offsetWidth** for horizontal carousels and **offsetHeight** for the vertical ones.
| items | Element[] | Carousel items.
| active | number | Active page.
| activeItem | Element | Closest element at the center of the viewport.
| numberOfPages | number | Number of pages on the carousel.
| numberOfItems | number | Number of items on the carousel.
| rects | Array<{node: Element, rect: DOMRect}> | It's an array containing all the DOMRects of every single element on the list, this ref will only be updated once after scrolling when **animate** is false, see [Animations](#animations).
| animationValues | number[] | Values used for animation, will only be calculated once after scrolling when **animate** is false, see [Animations](#animations).
| isDragging | boolean | Is true when the user is dragging the carousel using the mouse, will always be false when **mouseDrag** is false.
| isSnapping | boolean | Is true when the carousel is snapping, will always be false when **snap** is false.
| interpolate | (value: number or undefined, center: number, side: number) => number | Helper function to interpolate animation values. see [Examples](#examples)

### Methods

| Method | Type | Description |
| ------------- |:-------------:|:-------------|
| runOnScrollEnd | (func: () => void) => void | Run function on the next scroll end event. 
| saveDomRects | () => Array<{node: Element, rect: DOMRect}> | Calculates the data used for animation and returns it. 
| scrollTo | ({position: number, behavior?: string, force?: boolean}) => void | Sets the scrollLeft/scrollTop of the carousel. 
| nextItem | () => void | Focuses on the **next** sibling of the closest element at the center of the viewport. 
| previousItem | () => void | Focuses on the **previous** sibling of the closest element at the center of the viewport. 
| moveToPage | (pageIndex: number) => void | Goes to the given "page" index calculated using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight).
| moveToItem | (element: Element) => void | Focuses on the given item.
| moveToItemAtIndex | (itemIndex: Element) => void | Focuses on the item at the specied index.
| focusOnClick | (evt: PointerEvent) => void | Helper function to focus on the item when clicked, **@click="focusOnClick**.
| nextPage | () => void | Goes to the next "page" calculated using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight). 
| previousPage | () => void | Goes to the previous "page" calculated using scrollSize(scrollWidth/scrollHeight) and clientSize(offsetWidth/offsetHeight). 

## Events

| Event  | Type inferface | Description |
| ------------- |:-------------:|:-------------|
| number-of-pages | number | Returns the number of pages.
| client-size | number | Returns the client size, is the offsetWidth on horizontal carousels and offsetHeight on vertical ones.
| scroll-size | number | Returns the scroll size, is the scrollLeft on horizontal carousels and scrollTop on vertical ones.
| rects | Array<{node: Element, rect: DOMRect}> | Returns an array containing all the DOMRects of every single element on the list, this ref will only be updated once after scrolling when **animate** is false, see [Animations](#animations).
| items | Element[] | Returns the carousel items.
| animation-values | number[] | Values used for animation, will only be calculated once after scrolling when **animate** is false, see [Animations](#animations).
| scroll-start | undefined | Fires when the carousel starts scrolling.
| scroll-end | undefined | Fires when the carousel stops scrolling.
| snap-start | undefined | Fires just before the snap ocurs, never fires when **snap** is false.
| snap-end | undefined | Fires just after the snap, never fires when **snap** is false.
| mouse-drag-start | undefined | Fires when the users starts dragging the carousel using mouse, never fires when **mouseDrag** is false.
| mouse-drag-end | undefined | Fires when the users stops dragging the carousel using mouse, never fires when **mouseDrag** is false.

## Animations

By seting the **animate** prop to true, you will be able to use the **animationValues** to do animations, it's a list of numbers where each of them goes from -1 to 1. The closest the element is to the left side of the screen, the closer to -1 is its value, the closest the element is to the right side of the screen, the closer to 1 is its value. Then all you have to do is interpolate the values in your animations.

The list will update on the scroll event and will use **getBoundingClientRect** with **requestAnimationFrame** for EVERY single element of the list, which means your list will update A LOT, so don't forget to always use "transforms, opacity" and other properties that only cause a **repaint**, and to set the **will-change** css property to get a smooth effect. Also, the highest the number of childNodes, the less performant it will be, so be mindfull when using these animations.

You can create your own interpolation, you simply pass the animationValue and the desired numbers on the edges and on the center.

See [Animation Example](#animation-example)

## "scroll-snap-align" Animation Issue

If you're planning to use the css native **scroll-snap-align** property to snap your elements together with the **animate** for animations, you'll encounter some problems, the carousel lags a lot and just doesnt work, for now, use the **snap** prop to activate the javascript snapping feature.

If you won't use the animations, then you might as well just the native implementation and disable the javascript snapping.

## Examples
