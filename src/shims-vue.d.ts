declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

type ScrollerFunction = (options: {
  position: number;
  force?: boolean;
  behavior?: string;
}) => void

type Rects = Array<{node: Element, rect: DOMRect}>
