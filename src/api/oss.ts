import request from '../utils/request'

export function getOssToken() {
    return request.get(`/v1/oss/token`, {
    })
}
