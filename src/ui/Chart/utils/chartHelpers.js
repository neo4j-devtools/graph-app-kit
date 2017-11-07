export const applyDataLimit = (array, limit = 10) =>
  array.length > limit ? [...array.slice(1, limit + 1)] : [...array];
export const toHumanReadableBytes = input => {
  let number = +input;
  if (!isFinite(number)) {
    return "-";
  }

  if (number < 1024) {
    return `${number} B`;
  }

  number /= 1024;
  let units = ["KiB", "MiB", "GiB", "TiB"];

  for (let unit of Array.from(units)) {
    if (number < 1024) {
      return `${number.toFixed(2)} ${unit}`;
    }
    number /= 1024;
  }
  return `${number.toFixed(2)} PiB`;
};
export const asPercentage = (total, number) =>
  (number / total * 100).toFixed(2);
