import request from '../utils/request'

export function getTask(form: { page_index: number; page_size: number; sort: boolean; order: string }) {
    return request.get(`/backend/v1/task`, {
        params: {
            page_index: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order,
        },
    })
}

export function getTaskLogs(form: { page_index: number; page_size: number; sort: boolean; order: string }, search: { id: number }) {
    return request.get(`/backend/v1/task/log/${search.id}`, {
        params: {
            page_index: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order,
        },
    })
}

export function delAllTaskLogs(id: number) {
    return request.delete(`/backend/v1/task/log/${id}`, {
        params: {
            all: true
        },
    })
}


export function createTask(form: { host_id: number, name: string, spec: string, cmd: string, comment: string, effect_time: Date | null, expiry_time: Date | null }) {
    let effect_time = 0
    let expiry_time = 0
    if (form.effect_time) {
        effect_time = form.effect_time.getTime()
    }
    if (form.expiry_time) {
        expiry_time = form.expiry_time.getTime()
    }
    return request.post(`/backend/v1/task`, {
        name: form.name,
        host_id: form.host_id,
        spec: form.spec,
        cmd: form.cmd,
        comment: form.comment,
        effect_time: effect_time / 1000,
        expiry_time: expiry_time / 1000,
    })
}

export function editTask(form: { id: number, host_id: number, name: string, spec: string, cmd: string, comment: string, effect_time: Date | null, expiry_time: Date | null }) {
    let effect_time = 0
    let expiry_time = 0
    if (form.effect_time) {
        effect_time = form.effect_time.getTime()
    }
    if (form.expiry_time) {
        expiry_time = form.expiry_time.getTime()
    }
    return request.put(`/backend/v1/task/${form.id}`, {
        name: form.name,
        host_id: form.host_id,
        spec: form.spec,
        cmd: form.cmd,
        comment: form.comment,
        effect_time: effect_time / 1000,
        expiry_time: expiry_time / 1000,
    })
}

export function deleteTask(form: { id: number }) {
    return request.delete(`/backend/v1/task/${form.id}`)
}

export function stopTask(form: { id: number }) {
    return request.delete(`/backend/v1/task/stop/${form.id}`)
}

export function startTask(form: { id: number }) {
    return request.get(`/backend/v1/task/start/${form.id}`)
}

export function runTask(form: { id: number }) {
    return request.get(`/backend/v1/task/run/${form.id}`)
}
