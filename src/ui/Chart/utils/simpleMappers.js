import { applyDataLimit } from "./chartHelpers";

const valueAsNumber = (value, resultFormatter = i => i) => {
  const number = value.toNumber
    ? value.toNumber()
    : window.parseFloat(value) || 0;
  return resultFormatter(number);
};

export const singleValueAsNumber = (result, resultFormatter) => {
  const value = result.records[0].get(result.records[0].keys[0]);
  return valueAsNumber(value, resultFormatter);
};

export const singleValueAsNumberWithLabel = (result, props) => {
  if (props.headings) {
    return result.records.map(rec => {
      return props.headings.map(heading => {
        return {
          label: heading,
          value: valueAsNumber(rec.get(heading), props.resultFormatter)
        };
      });
    })[0];
  }
  return result.records.map(rec => {
    return {
      label: rec.get("key"),
      value: valueAsNumber(rec.get("value"), props.resultFormatter)
    };
  });
};

const responsePieHandler = (res, props) => {
  return singleValueAsNumberWithLabel(res, props);
};
const responseHandler = (res, tick, props) => {
  const y = singleValueAsNumber(res, props.resultFormatter);
  return [{ y, x: tick }];
};

export const cypherResultToXYChartData = (
  cypherResult,
  existingData,
  tick,
  props
) => {
  const data = cypherResult
    ? [...existingData, ...responseHandler(cypherResult, tick, props)]
    : existingData;
  return applyDataLimit(data);
};
export const cypherResultToCircularChartData = (
  cypherResult,
  existingData,
  props
) => {
  return cypherResult
    ? [...responsePieHandler(cypherResult, props)]
    : existingData;
};
