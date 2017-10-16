const Render = ({ if: cond, children }) => {
  return cond ? children : null;
};
export default Render;
