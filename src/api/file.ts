import request from '../utils/request'

export function getFiles() {
    return request.get(`/v1/file`)
}

export function getFile(id: number) {
    return request.get(`/v1/file/${id}`)
}


export function runFile(id: number) {
    return request.post(`/v1/file/run`, {
        id: id
    })
}

export function uploadFile(file: string, file_name: string, file_type: number) {
    return request.post(`/v1/file`, {
        file: file,
        file_name: file_name,
        file_type: file_type,
    })
}

export function updateFile(id: number, file: string, file_name: string, file_type: number) {
    return request.put(`/v1/file/${id}`, {
        file: file,
        file_name: file_name,
        file_type: file_type,
    })
}