import { computed, nextTick, Ref, SetupContext, watch } from 'vue'

export default ({
  modelValue, scrollTo,
  position,
  scrollSize, clientSize,
}: {
  scrollTo: ScrollerFunction;
  modelValue: Ref<number>;
  position: Ref<number>;
  scrollSize: Ref<number>;
  clientSize: Ref<number>;
}, {emit}: SetupContext<any>) => {
  const numberOfPages = computed(() => Math.ceil(scrollSize.value / clientSize.value))
  const active = computed(() => Math.ceil(position.value / clientSize.value))

  const goToPage = (val: number) => {
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
  }
 
  watch(active, val => emit("update:modelValue", val), {flush: "post"})
  watch(modelValue, goToPage)

  
  watch(numberOfPages, val => emit("number-of-pages", val))
  
  return {active, numberOfPages, goToPage}
}
