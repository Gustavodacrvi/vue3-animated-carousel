import { DefineComponent, ComponentPublicInstance, Plugin, ComputedRef, Ref, SetupContext, PropType } from 'vue';

declare const Vue3AnimatedCarousel: DefineComponent<{
  modelValue: {
    type: PropType<number>,
    default: 0,
  },
  position: {
    type: PropType<number>,
    default: 0,
  },
  activeItem: {
    type: PropType<Element>,
    default: null,
  },
  activeItemIndex: {
    type: PropType<number>,
    default: 0,
  },
  direction: {
    type: PropType<"horizontal" | "vertical">,
    default: "horizontal",
  },

  useFlexBox: {
    type: PropType<boolean>,
    default: true,
  },
  scrollBehavior: {
    type: PropType<string>,
    default: "smooth",
  },
  scrollSnapType: {
    type: PropType<string>,
    default: "both mandatory",
  },
  animate: {
    type: PropType<boolean>,
    default: false,
  },
  hideScroll: {
    type: PropType<boolean>,
    default: true,
  },
  snap: {
    type: PropType<boolean>,
    default: false,
  },
  mouseDrag: {
    type: PropType<boolean>,
    default: false,
  },
}, {
  saveDomRects: SaveDomRectsMethod;
  scrollTo: ScrollToMethod;
  runOnScrollEnd: RunOnScrollEndMethod;
  moveToItem: MoveToItemMethod;
  nextItem: NextItemMethod;
  previousItem: PreviousItemMethod;
  getClosestItemAtTheCenter: GetClosestItemAtTheCenterMethod;
  focusOnClick: FocusOnClickMethod;
  moveToItemAtIndex: MoveToItemAtIndex;
  interpolate: InterpolateMethod;
  
  carousel: CarouselNodeRef;
  activeItem: ActiveItemRef;
  activeItemIndex: ActiveItemIndexComputedRef;
  position: PositionRef;
  scrollSize: ScrollSizeRef;
  clientSize: ClientSizeRef;
  rects: RectsRef;
  items: ItemsRef;
  active: ActivePageComputedRef;
  numberOfPages: NumberOfPagesComputedRef;
  animationValues: AnimationValuesComputedRef;
  isSnapping: IsSnappingRef;
  isDragging: IsDraggingRef;
}>;


export default Vue3AnimatedCarousel

type CarouselEventsUnion = ("number-of-pages" | "client-size" | "scroll-size" | "rects" | "items" | "mouse-drag-start" | "mouse-drag-end" | "scroll-start" | "scroll-end" | "snap-start" | "snap-end" | "animation-values" | "update:modelValue" | "update:activeItem" | "update:activeItemIndex" | "update:position")[]

export type ScrollToMethod = (options: {
  position: number;
  force?: boolean;
  behavior?: string;
}) => void

export type CarouselCompositionSetupContext = SetupContext<CarouselEventsUnion>;

export type ItemRect = {node: Element, rect: DOMRect}

export type AnimatePropRef = Ref<boolean>;
export type IsHorizontalPropRef = Ref<boolean>;
export type ActiveItemPropRef = Ref<Element | null>;
export type ActiveItemIndexPropRef = Ref<number>;
export type MouseDragPropRef = Ref<boolean>;
export type ModelValuePropRef = Ref<number>;
export type PositionPropRef = Ref<number>;
export type ScrollBehaviorPropRef = Ref<string>;
export type SnapPropRef = Ref<boolean>;

export type InterpolateMethod = (value: number | undefined, center: number, side: number) => number;
export type SaveDomRectsMethod = () => ItemRect[];
export type NextItemMethod = () => Element | undefined;
export type PreviousItemMethod = () => Element | undefined;
export type MoveToItemAtIndex = (chlidNodeIndex: number) => Element | undefined;
export type FocusOnClickMethod = (evt: MouseEvent) => Element | null;
export type GoToPageMethod = (pageIndex: number) => number;

export type InitialSnapRef = Ref<null | 'page' | 'position' | 'item' | 'itemIndex'>;
export type GetClosestItemAtTheCenterMethod = (shouldSaveDomRects?: boolean) => Element;
export type RunOnScrollEndMethod = (func: () => void) => void;
export type MoveToItemMethod = (element: Element | HTMLElement | null) => void;
export type CarouselNodeRef = Ref<HTMLElement>;
export type ItemsRef = Ref<Element[]>;
export type RectsRef = Ref<ItemRect[]>;
export type PositionRef = Ref<number>;
export type ClientSizeRef = Ref<number>;
export type ScrollSizeRef = Ref<number>;
export type IsDraggingRef = Ref<boolean>;
export type ActiveItemRef = Ref<Element | null>;
export type IsSnappingRef = Ref<boolean>;

export type AnimationValuesComputedRef = ComputedRef<number[]>;
export type ActiveItemIndexComputedRef = ComputedRef<number>;
export type ActivePageComputedRef = ComputedRef<number>;
export type NumberOfPagesComputedRef = ComputedRef<number>;

export type CarouselRef = ComponentPublicInstance<unknown, unknown, unknown, {}, {
  saveDomRects: () => ItemRect[];
  scrollTo: (options: {
    position: number;
    force?: boolean;
    behavior?: string;
  }) => void;
  runOnScrollEnd: (func: () => void) => void;
  moveToItem: (element: Element | HTMLElement | null) => void;
  nextItem: () => Element | undefined;
  previousItem: () => Element | undefined;
  getClosestItemAtTheCenter: (shouldSaveDomRects?: boolean) => Element;
  focusOnClick: (evt: MouseEvent) => Element | null;
  moveToItemAtIndex: (chlidNodeIndex: number) => Element | undefined;
  interpolate: (value: number | undefined, center: number, side: number) => number;
}>

export type NumberOfPagesEvent = (numberOfPages: number) => void;
export type ClientSizeEvent = (clientSize: number) => void;
export type ScrollSizeEvent = (scrollSize: number) => void;
export type RectsEvent = (rects: Array<{node: Element, rect: DOMRect}>) => void;
export type ItemsEvent = (items: Element[]) => void;

export type MouseDragStartEvent = () => void;
export type MouseDragEndEvent = () => void;
export type ScrollStartStartEvent = () => void;
export type ScrollStartEndEvent = () => void;
export type SnapStartEvent = () => void;
export type SnapEndEvent = () => void;
export type AnimationValuesEvent = (animationValues: number[]) => void;
