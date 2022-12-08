import type { App } from 'vue';

import vuetify from './vuetify';
import { loadFonts } from './vuetify/webfontloader';

import router from './vue-router';

import { createPinia } from 'pinia';

export function registerAllPlugins(app: App) {
  /**
   * Vuetify
   */
  loadFonts();
  app.use(vuetify);
  /**
   * Vue Router
   */
  app.use(router);
  /**
   * Pinia
   */
  app.use(createPinia());
}
