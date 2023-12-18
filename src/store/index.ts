import {createStore} from 'vuex';
import {strict} from "assert";
import {map} from "lodash";


const tag_data = {
    index: 0,
    path: '',
    name: '',
    title: ''
}

/*
* */

export interface userInfo {
    uin: string
    nickName: string
    sex: string
    headUri: string
    isGroup: boolean
    lastCount: number

}

export interface message {
    msg: string
    sender_id: string
    receiver_id: string
    is_group: boolean
    created_time: number
}

export interface instructBody {
    name: string
    data: any
}


const tag_state = {
    tagsList: [tag_data],
    collapse: false,
    xtermIsEnv: false,
    wechat: {
        userInfo: <userInfo>{},
        friends: [],
        chatUser: <userInfo>{},
        instruct: [],
        messages: [],
    }
}

export default createStore({
    state: tag_state,
    mutations: {
        delTagsItem(state, data: typeof tag_data) {
            state
                .tagsList
                .splice(data.index, 1);
        },
        setTagsItem(state, data: typeof tag_data) {
            state
                .tagsList
                .push(data);
        },
        clearTags(state) {
            state.tagsList = [];
        },
        closeTagsOther(state, data) {
            state.tagsList = data;
        },
        closeCurrentTag(state, data) {
            for (let i = 0, len = state.tagsList.length; i < len; i++) {
                const item = state.tagsList[i];
                if (item.path === data.$route.fullPath) {
                    if (i < len - 1) {
                        data
                            .$router
                            .push(state.tagsList[i + 1].path);
                    } else if (i > 0) {
                        data
                            .$router
                            .push(state.tagsList[i - 1].path);
                    } else {
                        data
                            .$router
                            .push('/');
                    }
                    state
                        .tagsList
                        .splice(i, 1);
                    break;
                }
            }
        },
        // 侧边栏折叠
        handleCollapse(state, data) {
            state.collapse = data;
        }
    },
    actions: {},
    modules: {}
});
