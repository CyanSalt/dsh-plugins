import type { Options as WebSearchArkOptions } from '@cyansalt/dsh-web-search-ark'
import type { Context } from '@deepseek-ai/cordis'
import type { PluginConfigViewProps } from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { SettingsFieldState, SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives'
import {
  SettingsForm,
  SettingsFormModel,
  settingsNumberField,
  SettingsSecretField,
  settingsTextField,
  SettingsValueField,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { Options as PiAiOptions } from '@deepseek-ai/dsh-llm-pi-ai'
import type { FC } from 'react'
import React from 'react'
import { createEffectReconciler } from './utils/effect-reconciler'
import { SettingsFormPathScope } from './utils/settings-form-path-scope'
import type { Options as ArkSettingsOptions } from './index'

const NS = 'ui-settings-ark'

const en = {
  summary: 'Configure the selected model provider and web search.',
  unavailable: 'The selected model provider is not loaded, so it cannot be configured right now.',
  readOnly: 'This deployment stores settings read-only.',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
  save: 'Save',
  saving: 'Saving…',
  apiKey: 'API key',
  apiKeyHint: 'Stored outside the settings file. Leave blank to keep the current key.',
  apiKeyConfigured: 'A key is configured.',
  apiKeyMissing: 'No key is configured; requests are unavailable until one is.',
  baseURL: 'Endpoint',
  baseURLHint: 'Used for both model and web search requests.',
  maxKeyword: 'Max keywords per search',
  maxKeywordHint: 'How many keywords one search may use.',
  overridden: 'Overridden',
  reset: 'Reset to default',
  invalidNumber: 'Enter a number, or leave blank to use the default.',
  invalidText: 'Enter a value, or leave blank to use the default.',
}

const zh = {
  summary: '配置所选模型提供方与联网搜索。',
  unavailable: '所选模型提供方当前未加载，暂时无法配置。',
  readOnly: '本部署的设置为只读。',
  saveFailed: '本部署没有接受这些值，已保留供你修改。',
  save: '保存',
  saving: '保存中…',
  apiKey: 'API Key',
  apiKeyHint: '不写入设置文件。留空表示保持当前密钥。',
  apiKeyConfigured: '已配置密钥。',
  apiKeyMissing: '未配置密钥；配置之前无法发起请求。',
  baseURL: '接口地址',
  baseURLHint: '模型和网页搜索请求均使用此接口地址。',
  maxKeyword: '单次搜索最多关键词数',
  maxKeywordHint: '一次搜索最多可以使用多少个关键词。',
  overridden: '已覆盖',
  reset: '恢复默认',
  invalidNumber: '请填数字；留空表示使用默认值。',
  invalidText: '请填写内容；留空表示使用默认值。',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
    [NS]: keyof typeof en & keyof typeof zh,
  }
}

const FIELD_API_KEY = 'apiKey'

type ProviderProfile = NonNullable<PiAiOptions['providers']>[string]

interface SettingsFormEntry {
  form: SettingsFormModel<unknown>,
  fields: Set<string>,
}

interface ArkSettingsProjection extends SettingsFormShell {
  apiKey: SettingsFieldState,
  apiKeyConfigured: boolean,
  apiKeyWritable: boolean,
  baseURL: SettingsFieldState,
  baseURLWritable: boolean,
  hiddenFields: ArkSettingsOptions['hiddenFields'],
  maxKeyword: SettingsFieldState,
  maxKeywordWritable: boolean,
}

function mergeSettingsFormShells(
  shells: readonly SettingsFormShell[],
): SettingsFormShell {
  const availableShells = shells.filter(shell => shell.available)
  const writableShells = availableShells.filter(shell => shell.writable)
  return {
    available: availableShells.length > 0,
    writable: writableShells.length > 0,
    dirty: writableShells.some(shell => shell.dirty),
    invalid: writableShells.some(shell => shell.invalid),
    saving: availableShells.some(shell => shell.saving),
    failed: availableShells.some(shell => shell.failed),
  }
}

interface ArkSettingsCardProps {
  view: PluginConfigViewProps['view'],
  t: TranslateNS<typeof NS>,
  useArkSettingsCard: <T>(selector: (snapshot: ArkSettingsProjection) => T) => T,
  edit: (field: string, text: string) => void,
  resetField: (field: string) => void,
  save: () => void,
  discard: () => void,
}

const ArkSettingsCard: FC<ArkSettingsCardProps> = (props) => {
  const { view, t } = props
  if (view === 'summary') {
    return t('summary')
  }

  const state = props.useArkSettingsCard((snapshot) => snapshot)
  const hiddenFields = state.hiddenFields ?? []
  return (
    <SettingsForm
      labels={{
        unavailable: t('unavailable'),
        readOnly: t('readOnly'),
        saveFailed: t('saveFailed'),
        save: t('save'),
        saving: t('saving'),
      }}
      state={state}
      onSave={props.save}
      onDiscard={props.discard}
    >
      {!hiddenFields.includes('baseURL') && (
        <SettingsValueField
          id='plugin-config-ark-base-url'
          label={t('baseURL')}
          hint={t('baseURLHint')}
          overriddenLabel={t('overridden')}
          resetLabel={t('reset')}
          invalidLabel={t('invalidText')}
          disabled={!state.baseURLWritable}
          {...state.baseURL}
          onEdit={(text) => {
            props.edit('baseURL', text)
          }}
          onReset={() => {
            props.resetField('baseURL')
          }}
        />
      )}
      {!hiddenFields.includes(FIELD_API_KEY) && (
        <SettingsSecretField
          id='plugin-config-ark-api-key'
          label={t('apiKey')}
          hint={t('apiKeyHint')}
          disabled={!state.apiKeyWritable}
          text={state.apiKey.text}
          configured={state.apiKeyConfigured}
          stateLabel={state.apiKeyConfigured
            ? t('apiKeyConfigured')
            : t('apiKeyMissing')}
          onEdit={(text) => {
            props.edit(FIELD_API_KEY, text)
          }}
        />
      )}
      {!hiddenFields.includes('maxKeyword') && (
        <SettingsValueField
          id='plugin-config-ark-max-keyword'
          label={t('maxKeyword')}
          hint={t('maxKeywordHint')}
          overriddenLabel={t('overridden')}
          resetLabel={t('reset')}
          invalidLabel={t('invalidNumber')}
          numeric
          disabled={!state.maxKeywordWritable}
          {...state.maxKeyword}
          onEdit={(text) => {
            props.edit('maxKeyword', text)
          }}
          onReset={() => {
            props.resetField('maxKeyword')
          }}
        />
      )}
    </SettingsForm>
  )
}

class ArkSettingsCardController {

  private readonly providerScope: SettingsFormPathScope<ProviderProfile>
  private provider: string
  private hiddenFields: ArkSettingsOptions['hiddenFields']
  private readonly providerForm: SettingsFormModel<ProviderProfile>
  private readonly webSearchForm: SettingsFormModel<WebSearchArkOptions>
  private readonly formEntries: readonly SettingsFormEntry[]
  private credential = {
    configured: false,
    writable: true,
  }
  private readonly store: ReturnType<SettingsFormModel<ProviderProfile>['bind']>
  private readonly unsubscribe: () => void
  private readonly ctx: Context

  constructor(
    piAiScope: ConfigForm<PiAiOptions>,
    webSearchScope: ConfigForm<WebSearchArkOptions>,
    ctx: Context,
    provider: string,
    hiddenFields: ArkSettingsOptions['hiddenFields'],
  ) {
    this.ctx = ctx
    this.provider = provider
    this.hiddenFields = hiddenFields
    this.providerScope = new SettingsFormPathScope(piAiScope, [
      'providers',
      provider,
    ])
    this.providerForm = new SettingsFormModel(this.providerScope, [
      settingsTextField('baseURL'),
    ], [{
      field: FIELD_API_KEY,
      write: (text) => this.writeKey(text),
    }])
    this.webSearchForm = new SettingsFormModel(webSearchScope, [
      settingsNumberField('maxKeyword'),
    ])
    this.formEntries = [
      {
        form: this.providerForm,
        fields: new Set(['baseURL', FIELD_API_KEY]),
      },
      {
        form: this.webSearchForm,
        fields: new Set(['maxKeyword']),
      },
    ]
    this.store = this.providerForm.bind(() => this.projection())
    this.webSearchForm.bind(() => {
      this.store.set(this.projection())
      return undefined
    })
    this.unsubscribe = this.providerScope.subscribe(() => {
      this.readCredential()
    })
    this.readCredential()
  }

  private projection(): ArkSettingsProjection {
    const providerShell = this.providerForm.shell()
    const webSearchShell = this.webSearchForm.shell()
    return {
      ...mergeSettingsFormShells([providerShell, webSearchShell]),
      apiKey: this.getField(FIELD_API_KEY),
      apiKeyConfigured: this.credential.configured,
      apiKeyWritable: providerShell.available
        && providerShell.writable
        && this.apiKeyEnv() !== undefined
        && this.credential.writable,
      baseURL: this.getField('baseURL'),
      baseURLWritable: providerShell.available && providerShell.writable,
      hiddenFields: this.hiddenFields,
      maxKeyword: this.getField('maxKeyword'),
      maxKeywordWritable: webSearchShell.available && webSearchShell.writable,
    }
  }

  private async readCredential(): Promise<void> {
    const reference = this.apiKeyEnv()
    if (reference === undefined) return
    const response = await this.ctx.remote.credentials.describe([reference])
    if (reference !== this.apiKeyEnv()) return
    if (!response.ok) return
    const credential = response.value[reference]
    const next = {
      configured: credential.configured,
      writable: credential.writable,
    }
    if (
      next.configured === this.credential.configured
      && next.writable === this.credential.writable
    ) return
    this.credential = next
    this.store.set(this.projection())
  }

  refreshCredential(reference: string): void {
    if (reference === this.apiKeyEnv()) {
      this.readCredential()
    }
  }

  refreshProvider(provider: string): void {
    if (provider === this.provider) return
    this.provider = provider
    this.providerScope.setPath(['providers', provider])
    this.credential = {
      configured: false,
      writable: true,
    }
    this.store.set(this.projection())
    this.readCredential()
  }

  refreshHiddenFields(hiddenFields: ArkSettingsOptions['hiddenFields']): void {
    if (hiddenFields === this.hiddenFields) return
    this.hiddenFields = hiddenFields
    this.store.set(this.projection())
  }

  inject() {
    return {
      hooks: {
        arkSettingsCard: this.store,
      },
      edit: (field: string, text: string) => {
        this.formFor(field).actions().edit(field, text)
      },
      resetField: (field: string) => {
        this.formFor(field).actions().resetField(field)
      },
      save: () => {
        const forms: readonly SettingsFormModel<unknown>[] = [
          this.providerForm,
          this.webSearchForm,
        ]
        Promise.all(
          forms.filter(form => {
            const shell = form.shell()
            return shell.available && shell.writable
          }).map(form => form.save()),
        )
      },
      discard: () => {
        this.providerForm.actions().discard()
        this.webSearchForm.actions().discard()
      },
    }
  }

  private formFor(field: string) {
    const form = this.formEntries.find((entry) => entry.fields.has(field))?.form
    if (!form) {
      throw new Error(`Unknown settings field: ${field}`)
    }
    return form
  }

  private getField(field: string) {
    return this.formFor(field).field(field)
  }

  private async writeKey(value: string): Promise<boolean> {
    const reference = this.apiKeyEnv()
    if (reference === undefined) return false
    await this.ctx.remote.credentials.set(reference, value)
    await this.readCredential()
    return this.credential.configured
  }

  private apiKeyEnv(): string | undefined {
    return this.providerScope.getSnapshot().value?.apiKeyEnv
  }

  dispose(): void {
    this.unsubscribe()
    this.providerForm.dispose()
    this.webSearchForm.dispose()
  }

}

export const inject = [
  'slots',
  'locale',
  'remote',
  'remote.credentials',
  'configForms',
]

export function apply(ctx: Context): void {
  ctx.effect(
    () => ctx.locale.register(NS, { zh, en }),
    'ui-settings-ark: locale',
  )
  ctx.effect(
    () => ctx.configForms.whileServed([NS], () => ctx.effect(function* () {
      const configForm = ctx.configForms.get<ArkSettingsOptions>(NS)
      const initialConfig = configForm.getSnapshot().value
      const card = new ArkSettingsCardController(
        ctx.configForms.get<PiAiOptions>('llm-pi-ai'),
        ctx.configForms.get<WebSearchArkOptions>('web-search-ark'),
        ctx,
        initialConfig?.provider ?? 'ark',
        initialConfig?.hiddenFields,
      )
      const slotEffect = createEffectReconciler(
        () => [
          configForm.getSnapshot().value?.bundle ?? '@cyansalt/dsh-client-ui-settings-ark',
        ] as const,
        (key) => ctx.slots.inject(
          'plugins.bundle.config',
          () => ctx.slots.register({
            name: 'plugins.bundle.config',
            key,
            locale: NS,
            inject: () => card.inject(),
          }, ArkSettingsCard),
        ),
      )
      yield slotEffect.start()
      yield () => {
        card.dispose()
      }
      yield ctx.remote.$on('credentials/reference-updated', (reference: string) => {
        card.refreshCredential(reference)
      })
      yield configForm.subscribe(() => {
        const config = configForm.getSnapshot().value
        card.refreshProvider(config?.provider ?? 'ark')
        card.refreshHiddenFields(config?.hiddenFields)
        slotEffect.trigger()
      })
    }, 'ui-settings-ark: active config card')),
    'ui-settings-ark: plugin configuration',
  )
}
