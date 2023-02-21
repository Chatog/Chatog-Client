// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import basicSSL from '@vitejs/plugin-basic-ssl';

// Utilities
import { ConfigEnv, defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import DevConfig from './configs/dev-config.json';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const isDev = command === 'serve';

  return defineConfig({
    plugins: [
      vue(),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true
      }),
      basicSSL()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url))
      },
      extensions: ['.js', '.json', '.mjs', '.ts', '.vue']
    },
    server: {
      host: '0.0.0.0',
      port: DevConfig.DEV_SERVER_PORT,
      open: false,
      https: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  });
};
