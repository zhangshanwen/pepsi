import i18n from '../plugins/i18n';

import router from "../router";

import {ElMessage} from 'element-plus';

import axios from 'axios';

import {getToken, removeToken} from './auth';


const baseURL = import.meta.env.MODE === 'development'
    ? '/apps' : ''

const request = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 30
});


request.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8"';

request.interceptors.request.use(
    (config) => {
        let token = getToken();
        if (token) {
            config.headers = {
                authorization: token
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
    async (error) => {
        if (!error.response) {
            ElMessage.error(i18n.global.t('i18n.request_timeout'))
            return Promise.reject(error)
        }
        if (error.response.status === 401 && window.location.hash !== '#/login') {
            localStorage.removeItem('ms_username');
            removeToken();
            i18n.global.t('i18n.authentication_failure_pls_log_back_in')
            await router.push('/login')
            return Promise.reject(error)
        } else if (error.response.status === 403) {
            await router.push('/403')
            return Promise.reject(error)
        } else if (error.response.status === 404) {
            ElMessage.error(i18n.global.t('i18n.the_system_is_busy_pls_try_again_later'))
            return Promise.reject(error)
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
