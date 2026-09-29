import { defineConfig } from 'tsdown'
import { dshClient } from './scripts/dsh-client.ts'
import pkg from './package.json' with { type: 'json' }

export default defineConfig([
  {
    entry: [
      'src/index.ts',
    ],
    target: 'node22',
  },
  {
    entry: [
      'src/client.ts',
    ],
    plugins: [
      dshClient(pkg),
    ],
  },
])
