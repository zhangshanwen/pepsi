<template>
    <div class="contain">

        <el-button round class="save-button" type="primary" @click="clickSaveData" :disabled="disable.save">
            {{$t('i18n.save')}}
        </el-button>
        <el-card v-for="(group,index) in role_permissions" :key="index"
                 shadow="hover">
            <div slot="header">
                <el-checkbox v-model="group.is_checked" @change="permissionChange(group)"><b class="group-name">{{group.name}}</b>
                </el-checkbox>

            </div>
            <el-card v-for="item in group.children" class="permission-item" :key="item.id"
                     shadow="hover">
                <template #header>
                    <el-checkbox v-model="item.is_checked" @change="permissionChange(item)"><b class="nav-name">{{item.name}}</b>
                    </el-checkbox>
                </template>
                <div class="sub-permission-list" v-if="item.children.length">
                    <el-tag
                            class="sub-permission"
                            v-for="sub_item in item.children"
                            :key="sub_item.id"
                    >
                        <el-checkbox v-model="sub_item.is_checked" @change="permissionChange(sub_item)">
                            {{sub_item.name}}
                        </el-checkbox>
                    </el-tag>
                </div>
                <p
                        v-else
                        class="no-data"
                >{{$t('i18n.no_data')}}</p>
            </el-card>

        </el-card>
    </div>
</template>

<script lang="ts">
    import {defineComponent, reactive, inject, onMounted} from 'vue'
    import {useI18n} from 'vue-i18n'

    import {ElMessageBox, ElMessage} from 'element-plus';
    import lodash from 'lodash';

    import {permissionType} from '../types'
    import {editRolePermissions} from '../api/rolePermission';


    export default defineComponent({
        name: 'RolePermission',
        props: {
            role_permissions: Array,
            role_id: Number
        },
        setup(props) {

            const t = useI18n().t;


            const permission_ids = new Set()
            let old_permission_ids = new Set()
            const permission: permissionType = {}
            const permissions = []
            const disable = reactive({
                save: true
            })


            const clickSaveData = (message?: string) => {
                ElMessageBox.confirm(t('i18n.confirm_save_permission'), t('i18n.prompt'), {
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            if (props.role_id) {
                                editRolePermissions(props.role_id, permission_ids).then(res => {
                                    ElMessage.success(t('i18n.save_success'));
                                    disable.save = true;
                                    // loadData();
                                }).catch(() => {
                                });
                            } else {
                                ElMessage.error(t('i18n.error_id'));

                            }

                        }
                        done();
                    }
                }).catch(() => {
                });
            }

            const loadData = () => {
                setPermissionIds(props.role_permissions);
                old_permission_ids = lodash.clone(permission_ids);
            }
            const setPermissionIds = (role_permissions: any) => {
                role_permissions.forEach((item: any) => {
                    permission[item.id] = item;
                    permissions.push(item);
                    if (item.is_checked) {
                        permission_ids.add(item.id);
                    }
                    setPermissionIds(item.children);
                });
            }
            const checkedParents = (item: any, is_checked: boolean) => {
                if (item.parent_id === 0) {
                    return;
                }
                if (is_checked) {
                    permission_ids.add(item.parent_id);
                } else {
                    permission_ids.delete(item.parent_id);
                }
                permission[item.parent_id].is_checked = is_checked;
                checkedParents(permission[item.parent_id], is_checked);
            }
            const checkedChildren = (item: any, is_checked: any) => {
                item.children.forEach((sub_item: any) => {
                    sub_item.is_checked = is_checked;
                    if (is_checked) {
                        permission_ids.add(sub_item.id);
                    } else {
                        permission_ids.delete(sub_item.id);
                    }
                    checkedChildren(sub_item, is_checked);
                });
            }
            const permissionChange = (item: any) => {
                if (item.is_checked) {
                    permission_ids.add(item.id);
                    // 如果当前元素被勾选，其子元素全部被勾选，其父元素被勾选依此往上
                    checkedParents(item, true);
                    checkedChildren(item, true);
                } else {
                    permission_ids.delete(item.id);
                    // 如果当前元素被取消，其子元素全部取消,
                    checkedChildren(item, false);

                }
                setSaveDisable();
            }
            const setSaveDisable = () => {
                let difference1 = new Set([...permission_ids].filter(x => !old_permission_ids.has(x)));
                let difference2 = new Set([...old_permission_ids].filter(x => !permission_ids.has(x)));
                disable.save = (difference1.size === 0) && (difference2.size === 0);
            }
            onMounted(() => {
                loadData()
            })
            return {
                disable,

                clickSaveData,
                loadData,
                permissionChange
            }
        }
    })


</script>

<style scoped lang="sass">

    .contain
        background: #fff
        padding: 10px
        margin-bottom: 20px


        .save-button
            margin-bottom: 20px


        .permission-item
            display: inline-block
            width: 393px
            height: 210px
            margin: 0 20px 20px 0


        .nav-name
            font-size: 14px
            color: deepskyblue


        .group-name
            font-size: 20px
            color: orangered


        .sub-permission-list
            height: 120px
            overflow: auto


        .sub-permission
            margin: 0 10px 10px 0
            cursor: pointer


        .no-data
            text-align: center
            line-height: 100px
            color: #999
            font-size: 16px


</style>




