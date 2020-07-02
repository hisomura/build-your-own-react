// https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

// https://github.com/microsoft/TypeScript/issues/21309#issuecomment-376338415
// https://dev.classmethod.jp/articles/typings-of-window-object/
type RequestIdleCallbackHandle = any
type RequestIdleCallbackOptions = {
  timeout: number
}
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean
  timeRemaining: () => number
}

interface Window {
  myProp: number
  requestIdleCallback: (
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    opts?: RequestIdleCallbackOptions
  ) => RequestIdleCallbackHandle
  cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void
}
declare var window: Window
