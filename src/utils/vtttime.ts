
export function vtttime(time: number) {
    // 毫秒转换成时分秒表示
    let ms = time % 1000;
    ms = Math.round(ms);
    let mss = String(ms);
    if (mss.length == 1) {
        mss = "00" + mss;
    } else if (mss.length == 2) {
        mss = "0" + mss;
    }
    // 剩余秒数
    var s = Math.floor(time / 1000);
    return his(s) + '.' + mss;
}
;

function his(seconds: number) {
    var h = Math.floor(seconds / 3600);
    var i = Math.floor((seconds - h * 3600) / 60);
    var s = seconds % 60;

    return [zero(h), zero(i), zero(s)].join(':')
};

function zero(value: number) {
    if (value < 10) {
        return '0' + value;
    }
    return value;
};
