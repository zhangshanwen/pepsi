import request from '../utils/request'

export function getFiles(form: { page_index: number; page_size: number; sort: boolean; order: string }) {
    return request.get(`/backend/v1/file`, {data: form})
}

export function getFile(id: number) {
    return request.get(`/backend/v1/file/${id}`)
}

export function deleteFile(form: { id: number }) {
    return request.delete(`/backend/v1/file/${form.id}`)
}

export function runFile(form: { id: number }) {
    return request.post(`/backend/v1/file/run`, {
        id: form.id
    })
}

export function uploadFile(form: { file: string, name: string, file_type: string }) {
    return request.post(`/backend/v1/file`, {
        file: form.file,
        file_name: form.name,
        file_type: Number(form.file_type),
    })
}

export function updateFile(form: { id: number, file: string, name: string, file_type: string }) {
    return request.put(`/backend/v1/file/${form.id}`, {
        file: form.file,
        file_name: form.name,
        file_type: Number(form.file_type),
    })
}