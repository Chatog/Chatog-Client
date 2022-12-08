// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { viteMockServe } from 'vite-plugin-mock';

// Utilities
import { ConfigEnv, defineConfig, Plugin } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import DevConfig from './configs/dev-config.json';

/**
 * By default, vite will compile <script src="main.ts"> in index.html
 * to <script> and <style> with url = "/assets/xxx.yy". But this will
 * cause electron to misunderstand the absolute path, so we need to
 * add a '.' before.
 * @hint name "assets" is defined by `build.assetsDir` in vite.config.ts
 */
function AssetsImportPlugin(): Plugin {
  return {
    name: 'assets-import-plugin',
    // you can modify after-built `index.html` in this hook
    transformIndexHtml(html) {
      html = html.replaceAll(/\/assets/g, './assets');
      return html;
    }
  };
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const isDev = command === 'serve';
  const isBuildElectron = !isDev && mode === 'electron';

  /**
   * only build main.js and preload.js
   */
  if (isBuildElectron) {
    return defineConfig({
      build: {
        emptyOutDir: false,
        rollupOptions: {
          input: { main: 'electron/main.js', preload: 'electron/preload.js' },
          output: {
            entryFileNames: '[name].js'
          }
        }
      }
    });
  }

  // dev and build both needs these plugins
  const plugins = [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true
    })
  ];

  if (isDev) {
    // only enable mock-server in dev env
    plugins.push(
      viteMockServe({
        mockPath: 'mock',
        localEnabled: true
      })
    );
  } else {
    plugins.push(AssetsImportPlugin());
  }

  return defineConfig({
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url))
      },
      extensions: ['.js', '.json', '.mjs', '.ts', '.vue']
    },
    server: {
      host: '0.0.0.0',
      port: DevConfig.DEV_SERVER_PORT,
      open: true
    },
    build: {
      // module preload will cause path error in production env due to electron
      modulePreload: false
    }
  });
};
