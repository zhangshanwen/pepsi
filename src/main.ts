import {createApp} from 'vue'
import App from './App.vue'
import store from './store';
import router from './router/index'
import installElement from './plugins/element';
import i18n from './plugins/i18n';
import './assets/css/icon.css'

const app = createApp(App);

installElement(app);
// app.directive('focus', {
//     // 当被绑定的元素插入到 DOM 中时……
//     mounted(el) {
//         // Focus the element
//         el.focus()
//     }
// })

app
    .use(store)
    .use(i18n)
    .use(router)
    .mount('#app');
export default app
