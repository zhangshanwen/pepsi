import {jsonencode, jsondecode} from './base64'

const permissions = 'permissions'
const MenusKey = 'PERMISSIONS_MENUS'

export function has_permission(key: string) {
    return get_permissions().lastIndexOf(key) !== -1
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
