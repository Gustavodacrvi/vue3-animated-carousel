import { computed, nextTick, onMounted, ref, Ref, SetupContext, watch } from 'vue'

export default ({
  scrollTo,
  isHorizontal,
  clientSize,
  position,
  saveDomRects,
  propActiveItem,
  rects,
  items,
  runOnScrollEnd,
  propActiveItemIndex,
}: {
  scrollTo: ScrollerFunction;
  runOnScrollEnd: (func: () => void) => void;
  rects: Ref<Rects>;
  propActiveItem: Ref<Element | HTMLElement>;
  items: Ref<Element[]>;
  saveDomRects: () => void;
  isHorizontal: Ref<boolean>;
  clientSize: Ref<number>;
  propActiveItemIndex: Ref<number>;
  position: Ref<number>;
}, {emit}: SetupContext<any>) => {
  const activeItem = ref(null as unknown as Element)
  const activeItemIndex = computed(() => items.value.findIndex(item => item === activeItem.value))

  watch(activeItemIndex, val => emit("update:activeItemIndex", val), {flush: "post"})
  watch(activeItem, val => emit("update:activeItem", val), {flush: "post"})
  
  const moveToItem = (el: HTMLElement | Element | null) => {
    if (!el) return;
    const rect = el.getBoundingClientRect()
    const rectSize = isHorizontal.value ? rect.width : rect.height
    const offset = isHorizontal.value ? rect.x : rect.y

    scrollTo({
      position: position.value + ((offset + (rectSize / 2)) - (clientSize.value / 2))
    })
  }
  const getClosestItemAtTheCenter = ((getRects = true) => {
    const getDistanceFromCenter = ({rect}: {rect: DOMRect}, halfSize: number) => {
      if (isHorizontal.value) return Math.abs(halfSize - (rect.x + (rect.width / 2)))
      return Math.abs(halfSize - (rect.y + (rect.height / 2)))
    }
    getRects && saveDomRects()
    const val = rects.value
    const halfSize = clientSize.value / 2
    const distances = val.map(num => getDistanceFromCenter(num, halfSize))
    const closestDistance = distances.reduce((closest: number, current: number) => {
        if (current < closest) return current
        return closest
      }, Infinity)

    const closestObj = val[
        distances.findIndex(num => closestDistance === num)
      ]
    const item = (closestObj && closestObj.node)
    activeItem.value = item
    return item
  }) as (getRects?: boolean) => Element;
  const jumpTargetItem = (toMove: number) => {
    const target = getClosestItemAtTheCenter()
    return items.value[
      toMove + items.value.findIndex(node => node === target)
    ]
  }

  const infiniteLoop = () => {
    getClosestItemAtTheCenter()
    nextTick(() => {
      runOnScrollEnd(infiniteLoop)
    })
  }

  onMounted(() => {
    saveDomRects()
    getClosestItemAtTheCenter()
    runOnScrollEnd(infiniteLoop)
  })

  const moveToItemAtIndex = (childNodeIndex: number) => {
    items.value[childNodeIndex] && moveToItem(items.value[childNodeIndex])
  }

  watch(propActiveItem, moveToItem, {flush: "post"})
  watch(propActiveItemIndex, moveToItemAtIndex, {flush: "post"})

  return {
    activeItem,
    activeItemIndex,
    
    getClosestItemAtTheCenter,
    moveToItem,
    nextItem: () => {
      const next = jumpTargetItem(1)
      next && moveToItem(next)
    },
    previousItem: () => {
      const next = jumpTargetItem(-1)
      next && moveToItem(next)
    },
    moveToItemAtIndex,
    focusOnClick: (evt: PointerEvent) => {
      evt.currentTarget && moveToItem(evt.currentTarget as Element)
    },
  } as any

}
