
import { CarouselNodeRef, GetClosestItemAtTheCenterMethod, SaveDomRectsMethod, ItemsRef, AnimatePropRef, ClientSizeRef, IsHorizontalPropRef, RectsRef, InterpolateMethod, AnimationValuesComputedRef, CarouselCompositionSetupContext } from "vue3-animated-carousel"

import { computed, onBeforeUnmount, onBeforeUpdate, onMounted } from 'vue'

export default ({
  animate,
  items,
  carousel,
  rects,
  clientSize,
  isHorizontal,
  saveDomRects,
  getClosestItemAtTheCenter,
}: {
  items: ItemsRef;
  rects: RectsRef;
  getClosestItemAtTheCenter: GetClosestItemAtTheCenterMethod;
  saveDomRects: SaveDomRectsMethod;
  carousel: CarouselNodeRef;
  animate: AnimatePropRef;
  clientSize: ClientSizeRef;
  isHorizontal: IsHorizontalPropRef;

}, {emit}: CarouselCompositionSetupContext) => {
  const emitEvent = (values: number[]): any => emit("animation-values", values.slice())

  let ticking = false
  const getRects = () => {
    if (!animate.value) return;
    if (!ticking) {
      requestAnimationFrame(() => {
        saveDomRects()
        getClosestItemAtTheCenter(false)
        ticking = false
      })

      ticking = true
    }
  }

  onBeforeUpdate(saveDomRects)
  onMounted(() => {
    getRects()
    carousel.value.addEventListener("scroll", getRects, {passive: true})
    window.addEventListener("resize", getRects, {passive: true})
  })
  onBeforeUnmount(() => {
    window.removeEventListener("resize", getRects)
  })
      
  return {
    interpolate: ((value, center, side) => {
      return -(((Math.abs(value || 0) - 1) * (center - side)) - side)
    }) as InterpolateMethod,
    animationValues: (computed(() => {
      if (!animate.value) {
        const values = items.value.map(() => 0)
        emitEvent(values)
        return values
      }
      if (!carousel.value) {
        emitEvent([])
        return []
      }
      const sizeProperty = isHorizontal.value ? "width" : "height"
      const size = clientSize.value
      const halfSize = size / 2

      const values = rects.value.map(({rect}) => {
        const num = ((rect.x + (rect[sizeProperty] / 2)) / halfSize) - 1
        if (
          rect.x + (rect[sizeProperty] + (rect[sizeProperty] * 2)) < 0 ||
          (rect.x - (rect.x * 2)) > size
        ) return 0
        return num
      })
      emitEvent(values)
      return values
    })) as AnimationValuesComputedRef,
  }
}
