import * as qiniu from 'qiniu-js'


export function uploadFile(token: string, key: string, body: File) {
    const config = {
        useCdnDomain: true,
        region: qiniu.region.cnEast2,
        forceDirect: true // 是否上传全部采用直传方式
    };
    const putExtra: any = {
        fname: key, //文件原文件名
        mimeType: ['image/png', 'image/jpeg', 'image/gif'] //用来限制上传文件类型，为 null 时表示不对文件类型限制；
    };
    return qiniu.upload(body, key, token, putExtra, config)
}
