import { CarouselNodeRef, MouseDragPropRef, IsHorizontalPropRef, PositionRef, ScrollToMethod, IsDraggingRef, CarouselCompositionSetupContext } from "vue3-carousel"
import { onMounted, ref, watch } from 'vue'

export default ({
  isHorizontal,
  mouseDrag,
  scrollTo,
  carousel,
  position,
}: {
  isHorizontal: IsHorizontalPropRef;
  position: PositionRef;
  carousel: CarouselNodeRef;
  scrollTo: ScrollToMethod;
  mouseDrag: MouseDragPropRef;
}, {emit}: CarouselCompositionSetupContext) => {
  const isDragging = ref(false) as IsDraggingRef
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
