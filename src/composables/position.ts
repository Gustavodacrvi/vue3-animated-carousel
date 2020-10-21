
import { PositionPropRef, ScrollToMethod } from '@/types'
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
