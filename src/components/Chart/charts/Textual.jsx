import React from "react";
import { Statistic } from "semantic-ui-react";

export default ({ data = [], title }, rest) => {
  const d = data.length !== 0 ? data[data.length - 1] : data;
  return <Statistic label={title} value={d.y} {...rest} />;
};
