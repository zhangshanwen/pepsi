import request from '../utils/request'

export function getAdmins(form: { page_index: number; page_size: number; sort: boolean; order: string }) {
    return request.get(`/v1/admins`, {
        params: {
            page: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order,
        },
    })
}

export function createAdmin(form: { username: string; password: string }) {
    return request.post(`/v1/admins`, {
        username: form.username,
        password: form.password,
    })
}

export function editAdmin(form: { id: number; username: string }) {
    return request.put(`/v1/admins/${form.id}`, {username: form.username})
}

export function deleteAdmin(operate_id: number) {
    return request.delete(`/v1/user/${operate_id}`)
}

export function resetAdminPassword(operate_id: number) {
    return request.get(`/v1/admins/password/reset/${operate_id}`)
}

export function changePassword(password: string) {
    return request.put(`/v1/admins/password/change`, {
        password: password,
    })
}

export function changeRole(form: { id: number; role_id: number }) {
    return request.put(`/v1/admins/roles/change/${form.id}`, {
        role_id: form.role_id,
    })
}
