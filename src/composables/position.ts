
import { Ref, SetupContext, watch } from 'vue'

export default ({
  propPosition,
  scrollTo,
}: {
  scrollTo: ScrollerFunction;
  propPosition: Ref<number>;
}) => {
  watch(propPosition, val => scrollTo({position: val}))
}
