<template>
    <div :class="$style.flex">
        <div style="flex:1">
            <n-input v-model:value="value" type="text" placeholder="屏蔽词（正则）" />
        </div>
        <n-button @click="$emit('addBlockWord', value); value = ''">添加</n-button>
    </div>
    <n-tabs type="line" animated @update:value="(v) => tabValue = v">
        <n-tab-pane name="1" tab="屏蔽正则">
            <n-data-table :columns="colsReactive" :data="blockWordListdata" :max-height="height" :min-height="height"
                size="small" :row-key="(row) => row.index" />
        </n-tab-pane>
        <n-tab-pane name="2" tab="屏蔽用户">
            <n-data-table :columns="colsReactive" :data="blockUserListdata" :max-height="height" :min-height="height"
                size="small" :row-key="(row) => row.index" />
        </n-tab-pane>
    </n-tabs>

</template>

<script setup lang="ts">
import { NInput, NButton, NTabs, NTabPane, NDataTable, DataTableColumns } from 'naive-ui'
import { computed, h, ref } from 'vue';

const props = withDefaults(defineProps<{
    blockUserList: string[]
    blockWordList: string[]
    height?: string;
}>(), {
    height: '30em',
})


const emit = defineEmits<{
    (e: 'blockUserchange', blockUser: string): void
    (e: 'blockWordblockWord', blockWord: string): void
    (e: 'addBlockWord', blockWord: string): void
}>()

const value = ref("")
const tabValue = ref("1")

interface block {
    text: string
}

const colsReactive: DataTableColumns<block> = [
    {
        title: '内容',
        key: 'text',
    },
    {
        title: "删除",
        key: "delete",
        render: (row: block) => {
            return h(NButton, {
                size: "small",
                onClick: () => {
                    switch (tabValue.value) {
                        case "1":
                            emit('blockWordblockWord', row.text)
                            break;
                        case "2":
                            emit('blockUserchange', row.text)
                            break;
                    }
                }

            }, { default: () => '删除' })
        },
        width: "5em"
    }
]

const blockUserListdata = computed(() => {
    return props.blockUserList.map(user => {
        return {
            text: user
        }
    })
})
const blockWordListdata = computed(() => {
    return props.blockWordList.map(user => {
        return {
            text: user
        }
    })
})



</script>

<style module>
.flex {
    display: flex;
    align-items: baseline;
    column-gap: 0.5em;
}
</style>