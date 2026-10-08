import type { Context, Volatile } from '@deepseek-ai/cordis'
import type { Config as PiAiConfig } from '@deepseek-ai/dsh-llm-pi-ai'
import z from '@deepseek-ai/schemastery'
import { ArkWebSearchProvider } from './provider'

export const name = 'web-search-ark'
export const inject = ['agentDefaultModel', 'loader', 'web']

export const Config = z.object({
  provider: z.string().default('ark').volatile(),
  model: z.string().volatile(),
  maxKeyword: z.number().step(1).min(1).max(50).volatile(),
})
export type Config = ReturnType<typeof Config>
export type Options = { [K in keyof Config]?: Config[K] extends Volatile<infer T> ? T : never }

function getPluginConfig<T>(ctx: Context, id: string) {
  try {
    const entry = ctx.loader.resolve(id)
    return entry.fiber?.config as T | undefined
  } catch {
    return undefined
  }
}

export function apply(ctx: Context, config: Config) {
  ctx.web.registerSearchProvider(new ArkWebSearchProvider(name, ctx, () => {
    const provider = config.provider.get()
    const piAiConfig = getPluginConfig<PiAiConfig>(ctx, 'llm-pi-ai')
    const profiles = piAiConfig?.providers.get()
    const profile = profiles?.[provider]
    return {
      apiKeyEnv: profile?.apiKeyEnv,
      baseURL: profile?.baseURL ?? 'https://ark.cn-beijing.volces.com/api/v3',
      model: config.model.get(),
      maxKeyword: config.maxKeyword.get(),
    }
  }))
}
