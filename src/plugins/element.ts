import {App} from 'vue'

import ElementPlus from 'element-plus';
import localeZH from 'element-plus/lib/locale/lang/zh-cn';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const installElement = (app: App) => {
    // @ts-ignore
    app.use(ElementPlus, {locale: localeZH});
    // 注册element icon
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        // @ts-ignore
        app.component(key, component)
    }
}
export default installElement;

