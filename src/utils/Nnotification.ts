import { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { h } from "vue";
import { NAvatar, NButton } from "naive-ui";

export function NError(n: NotificationApiInjection, msg: string) {
    n.error({
        content: msg,
        title: "错误",
        action: () =>
            h(NButton, {
                onClick: () => {
                    location.reload();
                }
            }, "刷新")
    })

}