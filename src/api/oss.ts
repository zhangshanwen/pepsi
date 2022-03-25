import request from '../utils/request'

export function getOssToken() {
    return request.get(`/backend/v1/oss/token`, {
    })
}
