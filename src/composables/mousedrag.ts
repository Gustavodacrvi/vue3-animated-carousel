import { nextTick, onBeforeUnmount, onMounted, Ref, ref, SetupContext, watch } from 'vue'

export default ({
  isHorizontal,
  mouseDrag,
  scrollTo,
  carousel,
  position,
}: {
  isHorizontal: Ref<boolean>;
  position: Ref<number>;
  carousel: Ref<HTMLElement>;
  scrollTo: ScrollerFunction;
  mouseDrag: Ref<boolean>;
}, {emit}: SetupContext<any>) => {
  const isDragging = ref(false)
  const initialCursorPosition = ref(0)
  const initialCarouselPosition = ref(0)

  watch(isDragging, val => {
    if (val) emit("mouse-drag-start")
    else emit("mouse-drag-end")
  })

  const getPos = ({screenX, screenY}: MouseEvent) => isHorizontal.value ? screenX : screenY
  
  const drag = (evt: MouseEvent) => {
    if (!mouseDrag.value || !isDragging.value) return;
    const diff = initialCursorPosition.value - getPos(evt)
    
    if (diff) {
      scrollTo({
        position: initialCarouselPosition.value + diff,
        behavior: "auto",
        force: true,
      })
    }
  }
  const start = (evt: MouseEvent) => {
    if (!mouseDrag.value) return;
    initialCursorPosition.value = getPos(evt)
    initialCarouselPosition.value = position.value
    isDragging.value = true
  }
  const end = () => {
    isDragging.value = false
  }

  onMounted(() => {
    const div = carousel.value
    
    div.addEventListener("mouseup", end, {passive: true})
    div.addEventListener("mousedown", start, {passive: true})
    div.addEventListener("mousemove", drag, {passive: true})
  })

  return {isDragging}
}
