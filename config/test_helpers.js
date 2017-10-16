export const mockDriver = (
  runSpy = () => Promise.resolve(),
  closeSpy = () => Promise.resolve()
) => ({
  session: () => ({
    run: runSpy,
    close: closeSpy
  })
});
