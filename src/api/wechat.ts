import {AxiosRequestConfig} from 'axios'
import request from '../utils/request'


export function getQrcode() {
    return request.get(`/backend/v1/wechat/login/qrcode`,)
}

export function logout() {
    return request.delete(`/backend/v1/wechat/logout`,)
}


export function getInfo() {
    return request.get(`/backend/v1/wechat`,)
}

export function getFriends() {
    return request.get(`/backend/v1/wechat/friends`,)
}

export function getStatus() {
    return request.get(`/backend/v1/wechat/status`,)
}

export function getFunctions() {
    return request.get(`/backend/v1/wechat/rules/functions`,)
}


export function getRules(pagination: { page_index: number; page_size: number; sort: boolean; order: string }) {
    return request.get(`/backend/v1/wechat/rules`, {
        params: {
            page_index: pagination.page_index,
            page_size: pagination.page_size,
            sort: pagination.sort,
            order: pagination.order,
        },
    })
}

export function createRule(form: { name: string; key: string; reply: string; description: string }) {
    return request.post(`/backend/v1/wechat/rules`, {
        ...form
    })
}

export function editRule(form: { id: number; name: string; key: string; reply: string; description: string }) {
    return request.put(`/backend/v1/wechat/rules/${form.id}`, {
        ...form
    })
}

export function deleteRule(form: { id: number; }) {
    return request.delete(`/backend/v1/wechat/rules/${form.id}`)
}

export function getAvatar(params: { find_id: string, is_group: boolean }) {
    return request.get(`/backend/v1/wechat/avatar`, {
        params
    },)
}

