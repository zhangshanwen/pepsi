export function base642Url(data: string) {
    var
        raw = window.atob(data),
        length = raw.length,
        arr = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        arr[i] = raw.charCodeAt(i);
    }
    var blob = new Blob([arr], {type: 'img/jpeg'});
    return URL.createObjectURL(blob);
};
