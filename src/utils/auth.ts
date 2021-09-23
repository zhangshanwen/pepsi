import Cookies from 'js-cookie';
import {jsondecode, jsonencode} from "./base64";
import user_avatar from "../assets/img/img.jpg"

const TokenKey = 'Authorization';
const UserInfoKey = "pepsi_user_info"
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

interface UserInfo {
    username: string;
    avatar: { url: string, name: string };
}

export function getUserInfo() {
    let user_info: UserInfo = jsondecode(localStorage.getItem(UserInfoKey))
    if (!user_info) {
        user_info = {
            username: 'unknown',
            avatar: {url: user_avatar, name: user_avatar}
        }
    } else {
        if (!user_info.username) {
            user_info.username = 'unknown'
        }
        if (!user_info.avatar.name) {
            user_info.avatar = {url: user_avatar, name: user_avatar}
        }
    }
    return user_info

}

export function setUserInfo(user_info: UserInfo) {
    localStorage.setItem(UserInfoKey, jsonencode(user_info))
}
