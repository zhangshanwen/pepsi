import {ElMessage} from 'element-plus'

export const elMessageSuccess = (
    t: Function,
) => {
    ElMessage.success(t('i18n.success'))
    return {}
}


export const elMessageError = (
    err: any
) => {
    ElMessage.error(err)
    return {}
}

