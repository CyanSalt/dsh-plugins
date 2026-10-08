import type { Context } from '@deepseek-ai/cordis'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import type { WebSearchProvider, WebSearchRequest, WebSearchResult } from '@deepseek-ai/dsh-web'
import { WebError } from '@deepseek-ai/dsh-web'
import { isObjectLike } from 'lodash-es'

export interface ArkWebSearchProviderOptions {
  apiKeyEnv?: string,
  baseURL: string,
  model?: string,
  maxKeyword?: number,
}

export class ArkWebSearchProvider implements WebSearchProvider {

  readonly id: string

  private ctx: Context
  private resolveOptions: () => ArkWebSearchProviderOptions

  constructor(
    id: string,
    ctx: Context,
    resolveOptions: () => ArkWebSearchProviderOptions,
  ) {
    this.id = id
    this.ctx = ctx
    this.resolveOptions = resolveOptions
  }

  available() {
    const options = this.resolveOptions()
    return Boolean(options.apiKeyEnv)
  }

  async search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult> {
    const options = this.resolveOptions()
    const apiKey = options.apiKeyEnv
      ? await this.resolveAPIKey(options.apiKeyEnv)
      : undefined
    const model = options.model ?? this.ctx.agentDefaultModel.currentSelection().model
    let response: Response
    try {
      response = await fetch(`${options.baseURL}/responses`, {
        method: 'POST',
        redirect: 'error',
        headers: {
          ...(apiKey ? { authorization: `Bearer ${apiKey}` } : undefined),
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          stream: false,
          tools: [
            {
              type: 'web_search',
              max_keyword: options.maxKeyword,
            },
          ],
          input: [{
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `Perform a web search for the query: ${request.query}`,
              },
            ],
          }],
        }),
        signal,
      })
    } catch (error) {
      if (signal?.aborted) {
        throw new WebError('Ark web search aborted', 'WEB_ABORTED', {
          cause: signal.reason,
        })
      }
      throw new WebError(
        `Ark web search request failed: ${String(error)}`,
        'WEB_PROVIDER_ERROR',
        { cause: error },
      )
    }

    if (!response.ok) {
      let detail: string
      try {
        detail = await response.text()
      } catch {
        detail = ''
      }
      throw new WebError(
        `Ark web search error (HTTP ${response.status})${detail ? `: ${detail.slice(0, 1000)}` : ''}`,
        'WEB_PROVIDER_ERROR',
      )
    }

    try {
      return mapResponse(await response.json())
    } catch (error) {
      if (error instanceof WebError) throw error
      throw new WebError(
        `Ark returned an invalid web search response: ${String(error)}`,
        'WEB_PROVIDER_ERROR',
        { cause: error },
      )
    }
  }

  async resolveAPIKey(key: string) {
    const reference = credentialRef(key)
    const credentials = this.ctx.get('credentials')
    if (credentials !== undefined) {
      return (await credentials.resolve(reference))?.value
    }
    return launchEnvironmentOf(this.ctx).get(reference)?.value
  }

}

function mapResponse(payload: unknown) {
  if (!isObjectLike(payload)) {
    throw new WebError('Ark returned an invalid web search response', 'WEB_PROVIDER_ERROR')
  }

  const response = payload as Record<string, unknown>
  const output = Array.isArray(response.output) ? response.output : []
  const sources: { url: string, title?: string, snippet?: string }[] = []
  const seen = new Set<string>()
  const text: string[] = []
  let searched = false

  for (const itemValue of output) {
    if (!isObjectLike(itemValue)) continue
    const item = itemValue as Record<string, unknown>
    if (item.type === 'web_search_call') {
      searched = true
      addSources(sources, seen, item.search_results as unknown[])
      addSources(sources, seen, item.sources as unknown[])
    }
    if (item.type !== 'message' || !Array.isArray(item.content)) continue
    for (const blockValue of item.content) {
      if (!isObjectLike(blockValue)) continue
      const block = blockValue as Record<string, unknown>
      if (block.type === 'output_text' && typeof block.text === 'string') {
        text.push(block.text)
      }
      if (!Array.isArray(block.annotations)) continue
      for (const annotationValue of block.annotations) {
        if (!isObjectLike(annotationValue)) continue
        const annotation = annotationValue as Record<string, unknown>
        if (annotation.type !== 'url_citation') continue
        addSource(sources, seen, annotation)
      }
    }
  }

  if (!searched && sources.length === 0) {
    throw new WebError(
      'Ark did not execute web search or return URL citations',
      'WEB_PROVIDER_ERROR',
    )
  }

  const content = typeof response.output_text === 'string' && response.output_text.length > 0
    ? response.output_text
    : text.join('\n')
  return {
    ...(content.length > 0 ? { content } : {}),
    sources,
    truncated: false,
  }
}

function addSources(
  sources: { url: string, title?: string, snippet?: string }[],
  seen: Set<string>,
  candidates: unknown[],
) {
  if (!Array.isArray(candidates)) return
  for (const candidate of candidates) {
    if (isObjectLike(candidate)) {
      addSource(sources, seen, candidate as Record<string, unknown>)
    }
  }
}

function addSource(
  sources: { url: string, title?: string, snippet?: string }[],
  seen: Set<string>,
  candidate: Record<string, unknown>,
) {
  if (typeof candidate.url !== 'string' || candidate.url.length === 0 || seen.has(candidate.url)) {
    return
  }
  seen.add(candidate.url)
  const title = typeof candidate.title === 'string' && candidate.title.length > 0
    ? candidate.title
    : undefined
  const snippetValue = candidate.snippet ?? candidate.description ?? candidate.site_name
  const snippet = typeof snippetValue === 'string' && snippetValue.length > 0
    ? snippetValue
    : undefined
  sources.push({
    url: candidate.url,
    ...(title === undefined ? {} : { title }),
    ...(snippet === undefined ? {} : { snippet }),
  })
}
