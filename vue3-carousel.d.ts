import { DefineComponent, Plugin, ComputedRef, Ref, SetupContext } from 'vue';

declare const Vue3Carousel: DefineComponent & { install: Exclude<Plugin['install'], undefined> };
export default Vue3Carousel;

export type ScrollToMethod = (options: {
  position: number;
  force?: boolean;
  behavior?: string;
}) => void

export type CarouselCompositionSetupContext = SetupContext<("number-of-pages" | "client-size" | "scroll-size" | "rects" | "items" | "mouse-drag-start" | "mouse-drag-end" | "scroll-start" | "scroll-end" | "snap-start" | "snap-end" | "animation-values" | "update:modelValue" | "update:activeItem" | "update:activeItemIndex" | "update:position")[]>;

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

export type GetClosestItemAtTheCenterMethod = (getRects?: boolean) => Element;
export type RunOnScrollEndMethod = (func: () => void) => void;
export type MoveToItemMethod = (element: Element | EventTarget | HTMLElement | null) => void;
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

