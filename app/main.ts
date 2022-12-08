import { createApp } from 'vue';
import App from '@/App.vue';
import { registerAllPlugins } from '@/plugins';

const app = createApp(App);

registerAllPlugins(app);

app.mount('#app');
