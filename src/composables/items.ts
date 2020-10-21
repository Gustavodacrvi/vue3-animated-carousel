import { ActiveItemIndexComputedRef, ActiveItemRef, ClientSizeRef, GetClosestItemAtTheCenterMethod, IsHorizontalPropRef, ItemsRef, MoveToItemAtIndex, MoveToItemMethod, NextItemMethod, PositionRef, PreviousItemMethod, ActiveItemIndexPropRef, ActiveItemPropRef, RectsRef, RunOnScrollEndMethod, SaveDomRectsMethod, FocusOnClickMethod, ScrollToMethod, CarouselCompositionSetupContext } from '@/types'
import { computed, nextTick, onBeforeUpdate, onMounted, ref, watch } from 'vue'

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
  scrollTo: ScrollToMethod;
  runOnScrollEnd: RunOnScrollEndMethod;
  rects: RectsRef;
  propActiveItem: ActiveItemPropRef;
  items: ItemsRef;
  saveDomRects: SaveDomRectsMethod;
  isHorizontal: IsHorizontalPropRef;
  clientSize: ClientSizeRef;
  propActiveItemIndex: ActiveItemIndexPropRef;
  position: PositionRef;
}, {emit}: CarouselCompositionSetupContext) => {
  const activeItem = ref(null) as ActiveItemRef
  const activeItemIndex = computed(() => items.value.findIndex(item => item === activeItem.value)) as ActiveItemIndexComputedRef

  watch(activeItemIndex, val => emit("update:activeItemIndex", val), {flush: "post"})
  watch(activeItem, val => emit("update:activeItem", val), {flush: "post"})
  
  const moveToItem = (el => {
    if (!el) return;
    const rect = el.getBoundingClientRect()
    const rectSize = isHorizontal.value ? rect.width : rect.height
    const offset = isHorizontal.value ? rect.x : rect.y

    scrollTo({
      position: position.value + ((offset + (rectSize / 2)) - (clientSize.value / 2))
    })
  }) as MoveToItemMethod;
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
  }) as GetClosestItemAtTheCenterMethod;
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

  onBeforeUpdate(() => {
    saveDomRects()
    getClosestItemAtTheCenter()
  })
  onMounted(() => {
    saveDomRects()
    getClosestItemAtTheCenter()
    runOnScrollEnd(infiniteLoop)
  })

  const moveToItemAtIndex = (childNodeIndex => {
    const target = items.value[childNodeIndex]
    target && moveToItem(target)
    return target
  }) as MoveToItemAtIndex

  watch(propActiveItem, moveToItem, {flush: "post"})
  watch(propActiveItemIndex, moveToItemAtIndex, {flush: "post"})

  return {
    activeItem,
    activeItemIndex,
    
    getClosestItemAtTheCenter,
    moveToItem,
    nextItem: (() => {
      const next = jumpTargetItem(1)
      next && moveToItem(next)
      return next
    }) as NextItemMethod,
    previousItem: (() => {
      const next = jumpTargetItem(-1)
      next && moveToItem(next)
    }) as PreviousItemMethod,
    moveToItemAtIndex,
    focusOnClick: (evt => {
      evt.currentTarget && moveToItem(evt.currentTarget)
      return evt.currentTarget
    }) as FocusOnClickMethod,
  }

}
