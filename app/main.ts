import { createApp } from 'vue';
import App from '@/App.vue';
import { registerAllPlugins } from '@/plugins';
import '@/assets/style/common.css';

const app = createApp(App);

registerAllPlugins(app);

app.mount('#app');
