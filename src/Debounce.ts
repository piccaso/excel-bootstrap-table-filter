export default function debounce(fn: Function, ms = 600): Function {
    let timeoutId: number;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}