/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'assjs' {
  export default class ASS {
    constructor(source: string, video: HTMLVideoElement, options?: {
      container?: Element,
      resampling?: string,
    })
    resize(): void
    show(): void
    hide(): void
    destroy(): void
  }
}