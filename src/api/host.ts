import request from '../utils/request'

export function getHosts(pagination: { page_index: number; page_size: number; sort: boolean; order: string }) {
    return request.get(`/backend/v1/host`, {
        params: {
            page_index: pagination.page_index,
            page_size: pagination.page_size,
            sort: pagination.sort,
            order: pagination.order,
        },
    })
}

export function createHost(form: { name: string; host: string, connect_type: number, port: number, status: string, comment: string }) {
    return request.post(`/backend/v1/host`, {
        name: form.name,
        host: form.host,
        connect_type: form.connect_type,
        port: form.port,
        status: Number(form.status),
    })
}

export function editHost(form: { id: number, name: string; host: string, connect_type: number, port: number, status: string, comment: string }) {
    return request.put(`/backend/v1/host/${form.id}`, {
        name: form.name,
        host: form.host,
        connect_type: form.connect_type,
        port: form.port,
        status: Number(form.status),
    })
}

export function deleteHost(form: { id: number }) {
    return request.delete(`/backend/v1/host/${form.id}`)
}

