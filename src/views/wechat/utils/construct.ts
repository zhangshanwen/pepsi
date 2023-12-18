const timestamp = () => {
    return Date.parse(new Date().toString())
}

export function constructMsg(data: any, msgType: string) {

    return JSON.stringify({
        data: data,
        msg_type: msgType,
        timestamp: timestamp()/1000
    })
}


export const wsMsgType = {
    ping: 'ping',
    syncFriends: 'syncFriends',
    syncMessages: 'syncMessages',
    selfInfo: 'selfInfo',
    login: 'login',
    chat: 'chat',
}

export const formatterTime = (value: number) => {
    if (value > 0) {
        const newDate = new Date();
        newDate.setTime(value * 1000);
        return newDate.toLocaleString();
    } else {
        return '-';
    }
}
