import type { TsdownPlugin } from 'tsdown'

interface PackageManifest {
  name: string,
}

export function dshClient(pkg: PackageManifest): TsdownPlugin {
  return {
    name: 'dsh-client',
    tsdownConfig() {
      return {
        format: 'cjs',
        platform: 'browser',
        target: 'es2022',
        outExtensions: () => ({
          js: '.js',
        }),
        deps: {
          neverBundle: true,
        },
        outputOptions: {
          banner: `
window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory: (require) => {
`,
          intro: `
let module = { exports: {} };
let exports = module.exports;
`,
          footer: `
    return module.exports;
  }
});
`,
        },
      }
    },
  }
}
