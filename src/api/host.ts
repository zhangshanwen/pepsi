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

export function createHost(form: { name: string, host: string, username: string, password: string, connect_type: number, port: number, status: number, comment: string }) {
    return request.post(`/backend/v1/host`, form)
}

export function editHost(form: { id: number, name: string; host: string, username: string, password: string, connect_type: number, port: number, status: number, comment: string }) {
    return request.put(`/backend/v1/host/${form.id}`, form)
}

export function deleteHost(form: { id: number }) {
    return request.delete(`/backend/v1/host/${form.id}`)
}


export function createRoom(form: { id: number }) {
    return request.post(`/backend/v1/host/room`, form)
}

