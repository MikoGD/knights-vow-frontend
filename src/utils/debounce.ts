/**
 * Wraps your function in a debounce
 * @param callback Callback to run
 * @param wait time in miliseconds to wait
 * @returns function wrapped in debounce
 */
export function debounceFunction(
  callback: (...args: unknown[]) => void,
  wait = 500,
): (...args: unknown[]) => void {
  let timeoutId: number;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}
