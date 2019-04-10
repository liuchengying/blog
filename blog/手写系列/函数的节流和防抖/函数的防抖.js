// 函数的防抖
// 在高频触发函数的情况下，只执行最后一次的触发
// 减少性能的消耗
/**
 * 函数防抖
 *
 * @param {*} fn 包装的函数，需要触发的函数
 * @param {*} time 触发的时间间隔（若在该时间内没有新的触发，则视为上一次为最后一次）
 * @param {*} immediate 是否立即执行
 */
function debounce(fn, time, immediate) {
    let timer = null;
    return function () {
        let args = Array.prototype.slice.call(arguments);
        let _this = this;

        if (immediate) {
            fn.apply(_this, args);
        }

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(_this, args);
        }, time);
    }
}