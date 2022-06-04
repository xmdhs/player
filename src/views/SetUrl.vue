<template>
    <n-space vertical :size="20">
        <n-grid :cols="8" x-gap="5" item-responsive>
            <n-gi span="6">
                <n-input type="text" v-model:value="url" placeholder="视频直链" />
            </n-gi>
            <n-gi>
                <n-button @click="Form">播放</n-button>
            </n-gi>
        </n-grid>

        <n-upload :custom-request="customRequest" style="width: 75%;" :show-file-list="false">
            <n-upload-dragger>
                <n-text style="font-size: 16px">
                    点击或者拖动视频到该区域观看
                </n-text>
            </n-upload-dragger>
        </n-upload>
    </n-space>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NInput, NButton, NSpace, NUpload, NUploadDragger, NText, UploadCustomRequestOptions, NGrid, NGi } from 'naive-ui';

const url = ref('');

const router = useRouter();

function Form() {
    router.push({ name: "player", query: { video: url.value } });
}

let u = ""

function customRequest({
    file,
    data,
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
    onProgress
}: UploadCustomRequestOptions) {
    if (file.file) {
        onFinish()
        u = URL.createObjectURL(file.file);
        router.push({ name: "player", query: { video: u } });
    }
}

onActivated(() => {
    if (u) {
        URL.revokeObjectURL(u);
        u = "";
    }
    document.title = "播放器"
});

</script>

