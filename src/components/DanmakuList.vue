<template>
    <n-thing v-if="filtered">
        <template #header>
            找到 {{ data.length }} 条弹幕
        </template>
        <template #header-extra>
            <n-button strong secondary @click="clean">
                关闭
            </n-button>
        </template>
    </n-thing>
    <n-data-table :columns="colsReactive" :data="data" :row-props="rowProps" :max-height="height" :min-height="height"
        size="small" :row-key="(row) => row.index" :pagination="{ pageSize: 30, showQuickJumper: true }"
        :paginate-single-page="false" />
    <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
        v-if="showDropdown" :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>

<script setup lang="ts">
import { NDataTable, DataTableColumns, DropdownOption, NDropdown, NThing, NButton } from 'naive-ui'
import { h, nextTick, ref, watch } from 'vue';
import { dplayerDm } from '@/utils/interface';


const emit = defineEmits<{
    (e: 'addblockUser', blockName: string): void
}>()

const props = withDefaults(defineProps<{
    dmList: dplayerDm["data"];
    height?: string;
}>(), {
    height: '30em',
})


const x = ref(0)
const y = ref(0)
const showDropdown = ref(false)
const filtered = ref(false)

interface dm {
    time: string
    timeI: number
    text: string
    sendID: string
}

const data = ref<dm[]>([])

watch(props, readData)
readData()

function readData() {
    filtered.value = false
    data.value = []
    props.dmList.forEach(dm => {
        data.value.push({
            time: coverTime(dm[0]),
            text: dm[4],
            sendID: dm[3],
            timeI: dm[0]
        })
    })
}

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
        sorter(rowA, rowB) {
            return rowA.timeI - rowB.timeI
        }
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

let tempDmList: dm[] = []

async function handleSelect(e: string) {
    showDropdown.value = false
    switch (e) {
        case 'view':
            tempDmList = data.value.filter(() => true)
            data.value = tempDmList.filter(dm => {
                return dm.sendID == selectDm.sendID
            })
            filtered.value = true
            break;
        case 'blocked':
            emit('addblockUser', selectDm.sendID)
            break;

    }
}

function onClickoutside() {
    showDropdown.value = false
}

function clean() {
    data.value = tempDmList
    filtered.value = false
}

</script>

<style>
.n-pagination{
    flex-wrap: wrap;
}
</style>
