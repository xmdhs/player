<template>
    <n-space vertical :size="20">
        <n-grid :cols="8" x-gap="5" item-responsive>
            <n-gi span="6">
                <n-input type="text" v-model:value="url"
                    :placeholder="store.state.isWeb ? '视频直链' : '视频直链 / bvid / epid'" />
            </n-gi>
            <n-gi>
                <n-button @click="Form">播放</n-button>
            </n-gi>
        </n-grid>

        <n-grid :cols="8" item-responsive>
            <n-gi span="7 400:6">
                <n-upload :custom-request="customRequest" :show-file-list="false">
                    <n-upload-dragger>
                        <n-text style="font-size: 16px">
                            点击或者拖动视频到该区域观看
                        </n-text>
                    </n-upload-dragger>
                </n-upload>
            </n-gi>
        </n-grid>
    </n-space>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NInput, NButton, NSpace, NUpload, NUploadDragger, NText, UploadCustomRequestOptions, NGrid, NGi, useMessage } from 'naive-ui';
import { useStore } from '@/store/store';

const url = ref('');

const router = useRouter();
const message = useMessage();
const store = useStore();

function Form() {
    let u = url.value.toLowerCase();
    if ((u.startsWith("ep") || u.startsWith("bv")) && !store.state.isWeb) {
        if (!store.state.bilibili.logined) {
            message.info("请先登录");
            router.push('/login');
            return;
        }
        router.push({ name: "BiliCid", query: { videoID: url.value } });
        return
    }
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