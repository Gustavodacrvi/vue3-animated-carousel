
import { CarouselCompositionSetupContext, CarouselNodeRef, IsHorizontalPropRef, RunOnScrollEndMethod, ScrollBehaviorPropRef, ScrollToMethod } from "./../index"
import { onMounted, ref, watch } from 'vue'

export default ({
  carousel,
  isHorizontal,
  scrollBehavior,
}: {
  carousel: CarouselNodeRef;
  isHorizontal: IsHorizontalPropRef;
  scrollBehavior: ScrollBehaviorPropRef;
}, {emit}: CarouselCompositionSetupContext) => {
  
  const scrolling = ref(false)
  const isPressing = ref(false)
  const scrollEndActions = ref([] as Array<() => void>)
  const shouldScrollEndOnRemovePointer = ref(false)

  watch(scrolling, val => {
    if (val) emit("scroll-start")
    else emit("scroll-end")
  })

  const scrollTo: ScrollToMethod = ({
    position, behavior, force, 
  }) => {
    if (scrolling.value && !force) return;
    carousel.value.scrollTo({
      [isHorizontal.value ? "left" : "top"]: position,
      behavior: (behavior ? behavior : scrollBehavior.value) as any,
    })
  }

  const scrollEnd = () => {
    if (isPressing.value) return shouldScrollEndOnRemovePointer.value = true
    scrolling.value = false
    scrollEndActions.value.forEach(func => func())
    scrollEndActions.value = []
    return;
  }
  
  let timeout: any
  const scroll = () => {
    shouldScrollEndOnRemovePointer.value = false
    scrolling.value = true
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    
    timeout = setTimeout(scrollEnd, 100)
  }

  const romovedPointer = () => {
    isPressing.value = false
    shouldScrollEndOnRemovePointer.value && scrollEnd()
    shouldScrollEndOnRemovePointer.value = false
  }
  const pressed = () => {
    isPressing.value = true
  }
  
  onMounted(() => {
    const div = carousel.value
    
    div.addEventListener("scroll", scroll, {passive: true})
    div.addEventListener("pointerdown", pressed, {passive: true})
    div.addEventListener("pointerup", romovedPointer, {passive: true})
    div.addEventListener("touchstart", pressed, {passive: true})
    div.addEventListener("touchend", romovedPointer, {passive: true})
  })

  return {
    scrollTo,
    runOnScrollEnd: (func => scrollEndActions.value.push(func)) as RunOnScrollEndMethod,
  }
  
}
