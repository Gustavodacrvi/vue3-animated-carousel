import { nextTick, onMounted, ref, Ref, SetupContext } from 'vue'

export default ({
  scrollTo,
  isHorizontal,
  clientSize,
  position,
  saveDomRects,
  rects,
  items,
  runOnScrollEnd,
}: {
  scrollTo: ScrollerFunction;
  runOnScrollEnd: (func: () => void) => void;
  rects: Ref<Rects>;
  items: Ref<Element[]>;
  saveDomRects: () => void;
  isHorizontal: Ref<boolean>;
  clientSize: Ref<number>;
  position: Ref<number>;
}, {emit}: SetupContext<any>) => {
  const activeItem = ref(null as unknown as Element)
  
  const moveToItem = (el: HTMLElement | Element) => {
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
    emit("update:activeItem", item)
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

  return {
    activeItem,
    
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
    moveToItemAtIndex: (childNodeIndex: number) => {
      items.value[childNodeIndex] && moveToItem(items.value[childNodeIndex])
    },
    focusOnClick: (evt: PointerEvent) => {
      evt.currentTarget && moveToItem(evt.currentTarget as Element)
    },
  } as any

}
