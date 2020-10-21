
import { InitialSnapRef, PositionPropRef, ScrollToMethod } from "vue3-carousel"
import { onMounted, watch } from 'vue'

export default ({
  propPosition,
  scrollTo,
  initialSnap,
}: {
  initialSnap: InitialSnapRef;
  scrollTo: ScrollToMethod;
  propPosition: PositionPropRef;
}) => {
  watch(propPosition, val => scrollTo({position: val}))

  onMounted(() => {
    if (initialSnap.value === "position") {
      scrollTo({position: propPosition.value})
    }
  })
}
