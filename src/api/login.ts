import request from '../utils/request'

export function login(form: { username: string, password: string }) {
    return request.post(`/v1/admins/login`, {
        username: form.username,
        password: form.password,
    })
}
