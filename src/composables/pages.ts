import { ClientSizeRef, ModelValuePropRef, PositionRef, ActivePageComputedRef, ScrollSizeRef, ScrollToMethod, NumberOfPagesComputedRef, GoToPageMethod, CarouselCompositionSetupContext, InitialSnapRef } from "types"
import { computed, nextTick, onMounted, watch } from 'vue'

export default ({
  modelValue, scrollTo,
  position, initialSnap,
  scrollSize, clientSize,
}: {
  scrollTo: ScrollToMethod;
  initialSnap: InitialSnapRef;
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

  onMounted(() => {
    if (initialSnap.value === "page") {
      goToPage(modelValue.value)
    }
  })

  
  watch(numberOfPages, val => emit("number-of-pages", val))
  
  return {active, numberOfPages, goToPage}
}
