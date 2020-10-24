import { ref } from 'vue';
import { ActiveItemIndexPropRef, ActiveItemRef, InitialSnapRef, ModelValuePropRef, PositionPropRef } from './../index';

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

  if (modelValue.value !== 0) initialSnap.value = "page"
  else if (propActiveItemIndex.value !== 0) initialSnap.value = "itemIndex"
  else if (propPosition.value !== 0) initialSnap.value = "position"
  else if (propActiveItem.value !== null) initialSnap.value = "item"

  return {initialSnap}
}
