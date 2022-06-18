<template>
    <n-data-table :columns="colsReactive" :data="data" :row-props="rowProps" />
    <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
        :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane, NDataTable, DataTableColumns, NButton, DropdownOption, NDropdown } from 'naive-ui'
import { h, nextTick, ref } from 'vue';
import { dplayerDm } from '../utils/interface';

const props = defineProps<{
    dmList: dplayerDm["data"];
    BlockUser: string[];
    BlockWord: string[];
}>()

const x = ref(0)
const y = ref(0)
const showDropdown = ref(false)


type dm = {
    time: string
    text: string
    sendID: string
}

const data = ref<dm[]>([])

const options: DropdownOption[] = [
    {
        label: '编辑',
        key: 'edit'
    },
    {
        label: () => h('span', { style: { color: 'red' } }, '删除'),
        key: 'delete'
    }
]

const colsReactive: DataTableColumns<dm> = [
    {
        title: '时间',
        key: 'time'
    },
    {
        title: '内容',
        key: 'text'
    },
    {
        title: '发送者',
        key: 'sendID'
    }
]


function rowProps(row: dm) {
    return {
        onClick: async (e: MouseEvent) => {
            e.preventDefault()
            showDropdown.value = false
            await nextTick()
            showDropdown.value = true
            x.value = e.clientX
            y.value = e.clientY
        }
    }
}

function handleSelect() {
    showDropdown.value = false
    console.log('select')
}

function onClickoutside() {
    showDropdown.value = false
}

</script>

<style module>
</style>