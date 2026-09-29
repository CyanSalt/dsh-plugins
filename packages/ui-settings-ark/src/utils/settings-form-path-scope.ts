import type { SettingsFormPathOp, SettingsFormScope, SettingsFormScopeSnapshot } from '@deepseek-ai/dsh-client-ui-primitives'

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export class SettingsFormPathScope<T> implements SettingsFormScope<T> {

  private readonly scope: SettingsFormScope<unknown>
  private path: string[]

  constructor(
    scope: SettingsFormScope<unknown>,
    path: readonly string[],
  ) {
    this.scope = scope
    this.path = [...path]
  }

  setPath(path: readonly string[]): void {
    this.path = [...path]
  }

  getSnapshot(): SettingsFormScopeSnapshot<T> {
    const snapshot = this.scope.getSnapshot()
    return {
      ...snapshot,
      value: this.valueAt(snapshot.value),
      base: this.valueAt(snapshot.base),
      user: this.valueAt(snapshot.user),
    }
  }

  subscribe(listener: () => void): () => void {
    return this.scope.subscribe(listener)
  }

  mutate(ops: readonly SettingsFormPathOp[], revision: number | undefined): Promise<boolean> {
    const path = [...this.path]
    return this.scope.mutate(ops.map((op) => ({
      ...op,
      path: [...path, ...op.path],
    })), revision)
  }

  private valueAt(source: unknown): T | undefined {
    let value = source
    for (const segment of this.path) {
      if (!isObjectLike(value)) return undefined
      value = value[segment]
    }
    return value as T | undefined
  }

}
