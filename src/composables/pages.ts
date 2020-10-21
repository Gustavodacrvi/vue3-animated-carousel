import { ClientSizeRef, ModelValuePropRef, PositionRef, ActivePageComputedRef, ScrollSizeRef, ScrollToMethod, NumberOfPagesComputedRef, GoToPageMethod, CarouselCompositionSetupContext } from "vue3-carousel"
import { computed, nextTick, watch } from 'vue'

export default ({
  modelValue, scrollTo,
  position,
  scrollSize, clientSize,
}: {
  scrollTo: ScrollToMethod;
  modelValue: ModelValuePropRef;
  position: PositionRef;
  scrollSize: ScrollSizeRef;
  clientSize: ClientSizeRef;
}, {emit}: CarouselCompositionSetupContext) => {
  const numberOfPages = computed(() => Math.ceil(scrollSize.value / clientSize.value)) as NumberOfPagesComputedRef
  const active = computed(() => Math.ceil(position.value / clientSize.value)) as ActivePageComputedRef

  const goToPage = (val => {
    const number = numberOfPages.value
    let final = val
  
    if (final >= number) {
      final = number - 1
    }
    if (final <= 0) {
      final = 0
    }
    if (final !== val) {
      nextTick(() => {
        emit("update:modelValue", final)
      })
    }
    scrollTo({position: final * clientSize.value})
    return final
  }) as GoToPageMethod

  watch(active, val => emit("update:modelValue", val), {flush: "post"})
  watch(modelValue, goToPage)

  
  watch(numberOfPages, val => emit("number-of-pages", val))
  
  return {active, numberOfPages, goToPage}
}
