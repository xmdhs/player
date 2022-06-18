<template>
    <n-data-table :columns="colsReactive" :data="data" :row-props="rowProps" :max-height="'45em'" size="small" />
    <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown" v-if="showDropdown"
        :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>

<script setup lang="ts">
import { NDataTable, DataTableColumns, DropdownOption, NDropdown } from 'naive-ui'
import { h, nextTick, ref, watch, watchEffect } from 'vue';
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

interface dm {
    time: string
    text: string
    sendID: string
}

const data = ref<dm[]>([])

watchEffect(() => {
    props.dmList.forEach(dm => {
        data.value.push({
            time: coverTime(dm[0]),
            text: dm[4],
            sendID: dm[3]
        })
    })
})

// second to minute
function coverTime(time: number | string) {
    const second = Math.floor(Number(time))
    const minute = Math.floor(second / 60)
    const second2 = second % 60
    return `${minute}:${second2 < 10 ? '0' + second2 : second2}`
}


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
        width: "10%",
    },
    {
        title: '内容',
        key: 'text',
    },
    {
        title: '发送者',
        key: 'sendID',
        width: "15%",
    }
]

let selectDm: dm

function rowProps(row: dm) {
    return {
        onclick: async (e: MouseEvent) => {
            selectDm = row
            e.preventDefault()
            //showDropdown.value = false
            await nextTick()
            x.value = e.clientX
            y.value = e.clientY
            showDropdown.value = true
        },
        style: 'cursor: pointer;',
    }
}

function handleSelect(e: string) {
    showDropdown.value = false
    console.log(e, selectDm)
}

function onClickoutside() {
    debugger
    showDropdown.value = false
}

</script>

<style module>
</style>