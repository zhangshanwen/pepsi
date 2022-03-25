import request from '../utils/request'

export function getRolePermissions(roleId: number) {
    return request.get(`/backend/v1/roles/permissions/${roleId}`)
}

export function editRolePermissions(roleId: number, permission_ids: Set<any>) {
    return request.put(`/backend/v1/roles/permissions/${roleId}`, {
        permission_ids: Array.from(permission_ids),
    })
}
