
import { onBeforeUnmount, onBeforeUpdate, onMounted, ref, Ref, SetupContext, watch } from 'vue'

export default ({
  isHorizontal,
  carousel,
}: {
  isHorizontal: Ref<boolean>;
  carousel: Ref<HTMLElement>;
}, {emit}: SetupContext<any>) => {
  const getAvailableSize = () => {
    if (isHorizontal.value) return carousel.value.offsetWidth
    return carousel.value.offsetHeight
  }
  const getPosition = () => {
    if (isHorizontal.value) return carousel.value.scrollLeft
    return carousel.value.scrollTop
  }
  const getScrollSize = () => {
    if (isHorizontal.value) return carousel.value.scrollWidth
    return carousel.value.scrollHeight
  }
  const getItems = () => {
    if (!carousel.value) return []
    const children = carousel.value.children
    const nodes: Element[] = []

    for (const node of children) {
      nodes.push(node)
    }
    return nodes
  }

  const position = ref(0)
  const clientSize = ref(0)
  const scrollSize = ref(0)
  const items = ref([] as Element[])
  const rects = ref([] as Rects)

  watch(position, val => emit("update:position", val), {flush: "post"})
  watch(clientSize, val => emit("client-size", val))
  watch(scrollSize, val => emit("scroll-size", val))
  watch(items, val => emit("items", val))
  watch(rects, val => emit("rects", val))
  
  const saveDomRects = () => {
    rects.value = items.value.map(node => ({
      rect: node.getBoundingClientRect(),
      node,
    }))
    return rects.value
  }

  const calculate = () => {
    const div = carousel.value
    if (!div) return;

    position.value = getPosition()
    clientSize.value = getAvailableSize()
    scrollSize.value = getScrollSize()
    items.value = getItems()
  }

  onBeforeUpdate(calculate)
  onMounted(() => {
    calculate()
    window.addEventListener("resize", calculate, {passive: true})
    carousel.value.addEventListener("scroll", calculate, {passive: true})
  })
  onBeforeUnmount(() => {
    window.removeEventListener("resize", calculate)
  })

  return {position, clientSize, scrollSize, saveDomRects, rects, items}
}
