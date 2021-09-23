import * as sha256 from "fast-sha256";

export function sha256Str(data: ArrayBuffer) {
    const hash = new sha256.Hash();
    hash.update(new Uint8Array(data));
    const key = hash.digest();
    return Array.from(key, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');

}
