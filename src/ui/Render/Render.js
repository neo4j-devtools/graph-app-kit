export const Render = ({ if: cond, children }) => {
  return cond ? children : null;
};
