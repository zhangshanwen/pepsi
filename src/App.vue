<template>
    <router-view/>
</template>

<script>
</script>

<style lang="sass">
    *
        margin: 0
        padding: 0

    html,
    body,
    #app,
    .wrapper
        width: 100%
        height: 100%
        overflow: hidden


        .el-table
            th
                background:
                    color: #f5f7fa !important

            tr:hover
                background: #f6faff


        .pagination
            margin: 20px 0
            text-align: right


</style>
