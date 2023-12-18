<script lang="ts" setup>
import {computed, onMounted, ref, defineComponent, nextTick} from "vue";
import {useStore} from "vuex";
import {constructMsg, wsMsgType} from "../../utils/construct";
import {userInfo} from "../../../../store";

const store = useStore()

const friends = computed(() => {
  return store.state.wechat.friends
})

const currentId = computed(() => {
  return store.state.wechat.chatUser.uin
})

const selectSession = (u: userInfo) => {
  store.state.wechat.chatUser = u
  store.state.wechat.messages = []
  store.state.wechat.instruct.push({
    name: wsMsgType.syncMessages,
    data: {
      find_id: currentId,
      is_group: store.state.wechat.chatUser.isGroup,
      count: 0,
    }
  })
}
onMounted(() => {
  store.state.wechat.instruct.push({name: wsMsgType.syncFriends})
})
</script>

<template>
  <div class="list">
    <ul>
      <li v-for="item in friends" :class="{ active: item.uin === currentId }" @click="selectSession(item)">
        <img class="avatar" width="30" height="30" :alt="item.nickName" :src="item.headUri">
        <p class="name">{{ item.nickName }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.list {
  li {
    padding: 12px 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;
    transition: background-color .1s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .avatar, .name {
    vertical-align: middle;
  }

  .avatar {
    border-radius: 2px;
  }

  .name {
    display: inline-block;
    margin: 0 0 0 15px;
  }
}
</style>
