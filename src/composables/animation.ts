import { computed, onBeforeUnmount, onBeforeUpdate, onMounted, Ref, SetupContext } from 'vue'

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
  getClosestItemAtTheCenter: (getRects?: boolean) => Element;
  saveDomRects: () => void;
  carousel: Ref<HTMLElement>;
  animate: Ref<boolean>;
  clientSize: Ref<number>;
  isHorizontal: Ref<boolean>;
  items: Ref<Element[]>;
  rects: Ref<Rects>;
}, {emit}: SetupContext<any>) => {
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

  
  onBeforeUpdate(getRects)
  onMounted(() => {
    getRects()
    carousel.value.addEventListener("scroll", getRects, {passive: true})
    window.addEventListener("resize", getRects, {passive: true})
  })
  onBeforeUnmount(() => {
    window.removeEventListener("resize", getRects)
  })
      
  return {
    interpolate: (value: number | undefined, center: number, side: number) => {
      return -(((Math.abs(value || 0) - 1) * (center - side)) - side)
    },
    animationValues: computed(() => {
      if (!animate.value) {
        const values = items.value.map(rect => 0)
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
          rect.x + (rect[sizeProperty] + rect[sizeProperty]) < 0 ||
          (rect.x - rect.x) > size
        ) return 0
        return num
      })
      emitEvent(values)
      return values
    }),
  }
}
