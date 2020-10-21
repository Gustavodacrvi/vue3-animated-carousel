
import { PositionPropRef, ScrollToMethod } from "vue3-carousel"
import { watch } from 'vue'

export default ({
  propPosition,
  scrollTo,
}: {
  scrollTo: ScrollToMethod;
  propPosition: PositionPropRef;
}) => {
  watch(propPosition, val => scrollTo({position: val}))
}
