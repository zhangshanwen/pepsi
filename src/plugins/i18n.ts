import {createI18n} from 'vue-i18n'

import localeZH from 'element-plus/lib/locale/lang/zh-cn';
import localeEN from 'element-plus/lib/locale/lang/en';

import messages from '../utils/i18n';


const i18n = createI18n({
    locale: localeZH.name,
    fallbackLocale: localeEN.name,
    messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true,

});

export default i18n;
