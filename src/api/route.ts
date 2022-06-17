import request from '../utils/request'

export function getRoutes() {
    return request.get(`/backend/v1/routes`)
}


interface key2PathInterface {
    [key: string]: string
}

let key2Path: key2PathInterface = {
    '1_0_21313131231': '/permission',
    '1_1_1631110079332': '/route',
    '28_1_1631260060784': '/user',
    '28_2_1631260069872': '/admin',
    '28_3_1631260121599': '/role',
    '50_1_1646919662672': '/file',
    '50_2_1654153710016': '/host',
    '5_3_1655046177871': '/log',
    '50_3_1655103866059': '/task',
}

export default key2Path
