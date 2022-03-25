import request from '../utils/request'

export function createPermission(form: { name: string; parent_id: number; icon: string; key: string; route_ids: Array<number> }) {
    return request.post(`/backend/v1/permissions`, {
        name: form.name,
        parent_id: form.parent_id,
        icon: form.icon,
        key: form.key,
        route_ids: form.route_ids,
    })
}

export function getPermissions() {
    return request.get(`/backend/v1/permissions`)
}

export function delPermissions(form: { id: number }) {
    return request.delete(`/backend/v1/permissions/${form.id}`)
}

export function editPermissions(form: { id: number; name: any; parent_id: number; icon: string; key: string; route_ids: Array<number> }) {
    return request.put(`/backend/v1/permissions/${form.id}`, {
        name: form.name,
        parent_id: form.parent_id,
        icon: form.icon,
        key: form.key,
        route_ids: form.route_ids,
    })
}
