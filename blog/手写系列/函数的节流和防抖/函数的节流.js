// 函数的节流
// 在高频触发函数的情况下，降低触发的频率（准确说应该是降低执行的频率）
// 减少性能的消耗
/**
 * 函数节流
 *
 * @param {*} fn 包装的函数，需要触发的函数
 * @param {*} time 执行的时间间隔（若在不满足改时间间隔内的触发，都是为无效，不执行）
 * @param {*} immediate 是否立即执行
 */
function throttle(fn, time, immediate) {
    let timer = null;
    return function () {
        let args = Array.prototype.slice.call(arguments);
        let _this = this;

        if (immediate) {
            fn.apply(_this, args);
        }

        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(_this, args);
                clearTimeout(timer);
            }, time);
        }

    }
}``