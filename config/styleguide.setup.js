const sleep = (secs, shouldResolve = true, message) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (shouldResolve ? resolve(message) : reject(new Error(message))),
      secs * 1000
    );
  });
global.sleep = sleep;

const resolvingDriver = (waitSecs = 0, resolveTo = "Resolved") =>
  driver(true, waitSecs, resolveTo);
global.resolvingDriver = resolvingDriver;

const rejectingDriver = (waitSecs = 0, rejectTo = "Rejected") =>
  driver(false, waitSecs, rejectTo);
global.rejectingDriver = rejectingDriver;

const driver = (shouldResolve = true, waitSecs = 0, message = "") => ({
  session: () => ({
    close: () => {},
    run: () => sleep(waitSecs, shouldResolve, message)
  })
});
global.driver = driver;

const neo4jDesktopApi = {
  getContext: () => Promise.resolve({ x: 1 }),
  onContextUpdate: fn => {
    fn(1);
  }
};
global.neo4jDesktopApi = neo4jDesktopApi;
