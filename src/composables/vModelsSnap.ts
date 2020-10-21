import { onMounted, ref } from 'vue';
import { ActiveItemIndexPropRef, ActiveItemRef, InitialSnapRef, ModelValuePropRef, PositionPropRef } from 'vue3-carousel';

export default ({
  modelValue, propActiveItem,
  propActiveItemIndex, propPosition,
}: {
  modelValue: ModelValuePropRef;
  propActiveItemIndex: ActiveItemIndexPropRef;
  propActiveItem: ActiveItemRef;
  propPosition: PositionPropRef;
}) => {
  const initialSnap = ref(null) as InitialSnapRef

  onMounted(() => {
    if (modelValue.value !== 0) return initialSnap.value = "page"
    if (propActiveItemIndex.value !== 0) return initialSnap.value = "itemIndex"
    if (propPosition.value !== 0) return initialSnap.value = "position"
    if (propActiveItem.value !== null) return initialSnap.value = "item"
  })

  return {initialSnap}
}
