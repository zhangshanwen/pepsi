import {jsonencode, jsondecode} from './base64'

const permissions = 'permissions'
const MenusKey = 'PERMISSIONS_MENUS'
const permission_cache = "permission_cache"

export function has_permission(key: string) {
    return permissions.lastIndexOf(key) < 0
}

export function setPermissions(data: any[]) {
    localStorage.setItem(permissions, jsonencode(data))
}

export function get_permissions() {
    return jsondecode(localStorage.getItem(permissions))
}

export function savePermissionMenus(data: any[]) {
    localStorage.setItem(MenusKey, JSON.stringify(data))
}

export function getPermissionMenus() {
    return JSON.parse(<string>localStorage.getItem(MenusKey))
}
