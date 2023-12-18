<template>
  <div class="contain">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {reactive, ref, computed, onMounted, onUnmounted, nextTick} from "vue";


import Pagination from "../../components/Pagination.vue"

export default {
  name: "liveRoom",
  components: {Pagination},
  setup() {
    return {}
  }
}
</script>

<style scoped lang="sass">

.contain
  background: #fff
  padding: 10px
  margin-bottom: 20px


  .role_options
    margin-top: 20px
    margin-bottom: 20px


</style>

