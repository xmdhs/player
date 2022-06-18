<template>
    <n-data-table :columns="colsReactive" :data="data" :row-props="rowProps" :max-height="250" size="small"
        style="cursor: pointer;" />
    <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
        :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>

<script setup lang="ts">
import { NDataTable, DataTableColumns, DropdownOption, NDropdown } from 'naive-ui'
import { h, nextTick, ref } from 'vue';
import { dplayerDm } from '../utils/interface';

const props = defineProps<{
    dmList: dplayerDm["data"];
}>()

const emit = defineEmits<{
    (e: 'change', dmList: dplayerDm["data"]): void
    (e: 'block', blockName: string): void
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
        label: '查看',
        key: 'view'
    },
    {
        label: () => h('span', { style: { color: 'red' } }, '屏蔽'),
        key: 'blocked'
    }
]

const colsReactive: DataTableColumns<dm> = [
    {
        title: '时间',
        key: 'time',
    },
    {
        title: '内容',
        key: 'text',
        titleColSpan: 2,
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

function handleSelect(e: string) {
    showDropdown.value = false
    console.log(e)
}

function onClickoutside() {
    showDropdown.value = false
}

</script>

<style module>
</style>