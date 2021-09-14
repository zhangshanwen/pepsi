import {createApp} from 'vue'
import App from './App.vue'
import store from './store';
import router from './router/index'
import installElement from './plugins/element';
import i18n from './plugins/i18n';

const app = createApp(App);

installElement(app);

app
    .use(store)
    .use(i18n)
    .use(router)
    .mount('#app');
