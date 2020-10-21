import { nextTick, onBeforeUnmount, onMounted, ref, Ref, SetupContext, watch } from 'vue';

export default ({
  getClosestItemAtTheCenter,
  runOnScrollEnd,
  moveToItem,
  snap,
  carousel,
}: {
  carousel: Ref<HTMLElement>;
  snap: Ref<boolean>;
  getClosestItemAtTheCenter: (getRects?: boolean) => Element;
  runOnScrollEnd: (func: () => any) => void;
  moveToItem: (element: Element) => void;
}, {emit}: SetupContext<any>) => {
  const isSnapping = ref(false)
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
