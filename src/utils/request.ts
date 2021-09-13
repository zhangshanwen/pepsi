import i18n from '../plugins/i18n';

import {ElMessage} from 'element-plus';

import axios from 'axios';

import {getToken, removeToken} from './auth';


const baseURL = import.meta.env.MODE === 'development'
    ? '/apps'
    : import.meta.env.VITE_APP_BASE_URL

const request = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 10
});


request.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8"';

request.interceptors.request.use(
    (config) => {
        let token = getToken();
        if (token) {
            config.headers = {
                Authorization: token
            };
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
request.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return Promise.reject(response);
        }
    },
    (error) => {
        if (error.response.status === 401 && window.location.hash !== '#/login') {
            localStorage.removeItem('ms_username');
            removeToken();
            i18n.global.t('i18n.authentication_failure_pls_log_back_in')
            location.href = "/"
            return;
        } else if (error.response.status === 403) {
            location.href = "/403"
            return;
        } else if (error.response.status === 404) {
            ElMessage.error(i18n.global.t('i18n.the_system_is_busy_pls_try_again_later'))
            return;
        }
        try {
            ElMessage.error(i18n.global.t(`code.${error.response.data.code}`))

        } catch (e) {
            ElMessage.error(i18n.global.t('i18n.the_system_is_busy_pls_try_again_later'))
        }
        return Promise.reject(error.response.data);
    }
);
export default request;
