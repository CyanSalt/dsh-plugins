import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }
import { dshClient } from './scripts/dsh-client.ts'

export default defineConfig([
  {
    entry: [
      'src/index.ts',
    ],
    target: 'node22',
  },
  {
    entry: [
      'src/client.tsx',
    ],
    plugins: [
      dshClient(pkg),
    ],
  },
])
