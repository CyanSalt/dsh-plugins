import config from '@cyansalt/eslint-config'

export default config({
  configs: [
    {
      languageOptions: {
        parserOptions: {
          project: [
            './packages/*/tsconfig.json',
            './tsconfig.node.json',
          ],
        },
      },
    },
    {
      files: [
        '**/*.config.ts',
      ],
      rules: {
        'galaxy/import-extensions': 'off',
      },
    },
  ],
})
