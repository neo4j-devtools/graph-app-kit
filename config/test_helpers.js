export const mockDriver = (
  runSpy = () => Promise.resolve(),
  closeSpy = () => Promise.resolve()
) => ({
  session: () => ({
    run: runSpy,
    close: closeSpy
  })
});

export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}
