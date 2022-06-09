<template>
  <div>
    <template v-for="(item, index) in menus">
      <el-sub-menu v-if="item.children && item.children.length>0" :index="item.index" :key="item.id">
        <template #title>
          <el-icon>
            <Folder/>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <tree-menu :menus="item.children"></tree-menu>
      </el-sub-menu>
      <el-menu-item v-else :index="item.index" :key="item.id">
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue"

export default defineComponent({
  name: 'treeMenu',
  props: ['menus'],
});
</script>

