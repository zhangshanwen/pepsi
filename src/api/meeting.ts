import request from '../utils/request'

export function pushMeeting(mid: string, data: any) {
    return request.post(`/backend/v1/meeting/push/${mid}`, data)
}

export function createMeeting(data: any) {
    return request.post(`/backend/v1/meeting`, data)
}

export function getMeetings() {
    return request.get(`/backend/v1/meeting`, {})
}

export function joinMeeting(mid: string) {
    return request.get(`/backend/v1/meeting/join/${mid}`)
}

export function meetingOffset(mid: string) {
    return request.get(`/backend/v1/meeting/offset/${mid}`)
}
