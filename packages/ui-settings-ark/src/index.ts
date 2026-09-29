import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import pkg from '../package.json' with { type: 'json' }

export const name = 'ui-settings-ark'

export const Config = z.object({
  bundle: z.string().default(pkg.name),
  provider: z.string().default('ark').volatile(),
})
export type Config = ReturnType<typeof Config>
export type Options = { [K in keyof Config]?: Config[K] extends Volatile<infer T> ? T : never }

export function apply() {}
