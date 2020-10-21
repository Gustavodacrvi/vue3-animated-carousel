import { CarouselCompositionSetupContext, CarouselNodeRef, GetClosestItemAtTheCenterMethod, IsSnappingRef, MoveToItemMethod, RunOnScrollEndMethod, SnapPropRef } from '@/types';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export default ({
  getClosestItemAtTheCenter,
  runOnScrollEnd,
  moveToItem,
  snap,
  carousel,
}: {
  carousel: CarouselNodeRef;
  snap: SnapPropRef;
  getClosestItemAtTheCenter: GetClosestItemAtTheCenterMethod;
  runOnScrollEnd: RunOnScrollEndMethod;
  moveToItem: MoveToItemMethod;
}, {emit}: CarouselCompositionSetupContext) => {
  const isSnapping = ref(false) as IsSnappingRef
  const waitingForSnap = ref(false)

  watch(isSnapping, val => {
    if (val) emit("snap-start")
    else emit("snap-end")
  })

  const snapToCenter = () => moveToItem(getClosestItemAtTheCenter())

  const scroll = () => {
    if (snap.value && !isSnapping.value && !waitingForSnap.value) {
      waitingForSnap.value = true
      runOnScrollEnd(() => {
        waitingForSnap.value = false
        isSnapping.value = true
        snapToCenter()
        nextTick(() => {
          runOnScrollEnd(() => {
            isSnapping.value = false
          })
        })
      })
    }
  }

  watch(snap, val => val && snapToCenter())
  
  onMounted(() => {
    window.addEventListener("resize", scroll, {passive: true})
    carousel.value.addEventListener("scroll", scroll, {passive: true})
  })
  onBeforeUnmount(() => {
    window.removeEventListener("resize", scroll)
  })

  return {
    isSnapping,
  }

}
