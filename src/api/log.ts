import request from '../utils/request'

export function getLogs(form: { page_index: number; page_size: number; sort: boolean; order: string }, search: { types: Array<number> }) {
    return request.get(`/backend/v1/log`, {
        params: {
            page_index: form.page_index,
            page_size: form.page_size,
            sort: form.sort,
            order: form.order,
            types: search.types.join(","),
        },
    })
}

