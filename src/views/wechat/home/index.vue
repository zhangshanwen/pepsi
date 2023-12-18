<script lang="ts">

import Card from './components/card.vue';
import List from './components/list.vue';
import MText from './components/text.vue';
import Message from './components/message.vue';
import {defineComponent} from "vue";

export default defineComponent({
  components: {Card, List, MText, Message},
  setup() {
    return {}
  }
})
</script>

<template>
  <div id="app">
    <div class="sidebar">
      <card></card>
      <list></list>
    </div>
    <div class="main">
      <message class="message"></message>
      <m-text class="mText"></m-text>
    </div>
  </div>
</template>

<style lang="less" scoped>
#app {
  //margin: 20px auto;
  width: 100%;
  height: 100%;
  display: flex;
  //overflow: scroll;
  border-radius: 3px;


  .sidebar {
    height: 100%;
    flex: auto;
    width: 18%;
    color: #f4f4f4;
    background-color: #2e3238;
  }

  .main {
    height: 100%;
    flex: auto;
    width: 82%;
    //position: relative;
    //overflow: hidden;
    background-color: #eee;
    overflow-y: hidden;
  }

  .message {
    height: 80%;
  }

  .mText {
    height: 20%;
  }
}
</style>
