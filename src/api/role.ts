import request from '../utils/request'

export function getRoles(form: { page_index: number; page_size: number; sort: boolean; order: string }) {
  return request.get(`/v1/roles`, {
    params: {
      page: form.page_index,
      page_size: form.page_size,
      sort: form.sort,
      order: form.order,
    },
  })
}

export function createRole(form: { name: string }) {
  return request.post(`/v1/roles`, {
    name: form.name,
  })
}

export function editRole(form: { id: number; name: any }) {
  return request.put(`/v1/roles/${form.id}`, {
    name: form.name,
  })
}

export function deleteRole(form: { id: number }) {
  return request.delete(`/v1/roles/${form.id}`)
}
