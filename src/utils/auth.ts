import Cookies from 'js-cookie';
const TokenKey = 'Authorization';

let minute = 60 * 1000;

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token: string) {
    const inFifteenMinutes = new Date(
        new Date().getTime() + 12 * 60 * minute
    );
    return Cookies.set(TokenKey, token, {
        expires: inFifteenMinutes
    });
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}
