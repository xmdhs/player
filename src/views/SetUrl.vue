<template>
    <n-space vertical>
        <n-space :align="'baseline'">
            <n-input size="large" type="text" v-model:value="url" style="min-width: 50em;" />
            <n-button @click="Form">播放</n-button>
        </n-space>

        <n-upload :custom-request="customRequest" style="max-width: 50em;" :show-file-list="false">
            <n-upload-dragger>
                <n-text style="font-size: 16px">
                    点击或者拖动文件到该区域观看本地视频
                </n-text>
            </n-upload-dragger>
        </n-upload>
    </n-space>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NInput, NButton, NSpace, NUpload, NUploadDragger, NText, UploadCustomRequestOptions, UploadFileInfo, } from 'naive-ui';

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
});

</script>

