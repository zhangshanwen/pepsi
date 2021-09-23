import request from '../utils/request'

export function getUsers(pagination: { page_index: number; page_size: number; sort: boolean; order: string }) {
    return request.get(`/v1/users`, {
        params: {
            page_index: pagination.page_index,
            page_size: pagination.page_size,
            sort: pagination.sort,
            order: pagination.order,
        },
    })
}

export function createUser(form: { username: string; password: string }) {
    return request.post(`/v1/users`, {
        username: form.username,
        password: form.password,
    })
}

export function editUser(form: { id: number; username: string }) {
    return request.put(`/v1/users/${form.id}`, {
        username: form.username,
    })
}

export function deleteUser(form: { id: number }) {
    return request.delete(`/v1/users/${form.id}`)
}

export function resetUserPassword(form: { id: number }) {
    return request.get(`/v1/users/password/reset/${form.id}`)
}

export function adjustUserBalance(form: { id: number, amount: number }) {
    return request.patch(`/v1/users/balance/adjust/${form.id}`, {
        amount: form.amount * 100
    })
}
