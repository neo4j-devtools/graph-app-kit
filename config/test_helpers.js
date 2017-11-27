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

export const desktopApiContexts = {
  activeGraph: {
    projects: [
      {
        graphs: [
          {
            status: "ACTIVE",
            connection: {
              configuration: {
                protocols: {
                  bolt: {
                    host: "localhost",
                    port: 7687,
                    tlsLevel: "OPTIONAL"
                  }
                }
              }
            }
          }
        ]
      }
    ]
  }
};
