<script setup>

import {useStore} from 'vuex'
import {computed, onMounted, ref, watch} from "vue";
import {wsMsgType} from "@/views/wechat/utils/construct";

const store = useStore()


const nickName = computed(() => {
  return store.state.wechat.userInfo.nickName
})

const imageUrl = computed(() => {
  return store.state.wechat.userInfo.headUri
})
onMounted(() => {
  store.state.wechat.instruct.push({name: wsMsgType.selfInfo})
})
</script>

<template>
  <div class="card">
    <header>
      <img class="avatar" id="avatar" width="40" height="40" :alt="nickName"
           :src="imageUrl">
      <p class="name">{{ nickName }}</p>
    </header>
    <footer>
      <input class="search" type="text" placeholder="search user...">
    </footer>
  </div>
</template>

<style scoped lang="less">
.card {
  padding: 12px;
  border-bottom: solid 1px #24272C;

  footer {
    margin-top: 10px;
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
    font-size: 16px;
  }

  .search {
    padding: 0 10px;
    width: 100%;
    font-size: 12px;
    color: #fff;
    height: 30px;
    line-height: 30px;
    border: solid 1px #3a3a3a;
    border-radius: 4px;
    outline: none;
    background-color: #26292E;
  }
}
</style>
