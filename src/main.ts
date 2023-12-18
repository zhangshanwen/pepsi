import {createApp} from 'vue'
import App from './App.vue'
import store from './store';
import router from './router/index'
import i18n from './plugins/i18n';
import installElement from './plugins/element';
const app = createApp(App);

// @ts-ignore
installElement(app);

// @ts-ignore
app
    .use(store)
    .use(i18n)
    .use(router)
    .mount('#app');
