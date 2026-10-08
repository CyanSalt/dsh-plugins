export interface EffectReconciler {
  start(): () => void,
  trigger(): void,
  dispose(): void,
}

function areDependenciesEqual(
  previous: readonly unknown[],
  next: readonly unknown[],
): boolean {
  return previous.length === next.length
    && previous.every((value, index) => Object.is(value, next[index]))
}

export function createEffectReconciler<T extends readonly unknown[]>(
  getDependencies: () => T,
  createEffect: (...dependencies: T) => () => void,
): EffectReconciler {
  let previous: T | undefined
  let cleanup: (() => void) | undefined
  let disposed = false
  let disposing = false
  let dirty = false

  const release = () => {
    const fn = cleanup
    previous = undefined
    cleanup = undefined
    fn?.()
  }

  const trigger = () => {
    if (disposed) return
    if (disposing) {
      dirty = true
      return
    }
    const next = getDependencies()
    if (previous !== undefined && areDependenciesEqual(previous, next)) return

    dirty = false
    disposing = true
    try {
      release()
    } finally {
      disposing = false
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (disposed) return

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const current = dirty ? getDependencies() : next
    cleanup = createEffect(...current)
    previous = current
  }

  const dispose = () => {
    if (disposed) return
    disposed = true
    release()
  }

  const start = () => {
    dispose()
    disposed = false
    trigger()
    return dispose
  }

  return {
    start,
    trigger,
    dispose,
  }
}
