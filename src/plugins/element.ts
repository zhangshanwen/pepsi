import {App} from 'vue'

import ElementPlus from 'element-plus';
import localeZH from 'element-plus/lib/locale/lang/zh-cn';
import 'element-plus/dist/index.css';

const installElement = (app: App) => {
    app.use(ElementPlus, {locale: localeZH});
}
export default installElement;
