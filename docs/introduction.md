In the playground you see all available components and most of them are **interactive**.  
_You can modify the code examples you see on this page to play around with them._

Since many of the components rely on [neo4j-driver](https://github.com/neo4j/neo4j-javascript-driver) and `neo4jDesktopApi` fake globals are available for you.

These are:

```javascript static
const sleep = (secs, shouldResolve = true, message) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (shouldResolve ? resolve(message) : reject(new Error(message))),
      secs * 1000
    );
  });
  
const driver = (shouldResolve = true, waitSecs = 0, message = "") => ({
  session: () => ({
    close: () => {},
    run: () => sleep(waitSecs, shouldResolve, message)
  })
});

const rejectingDriver = (waitSecs = 0, rejectTo = "Rejected") =>
  driver(false, waitSecs, rejectTo);

const resolvingDriver = (waitSecs = 0, resolveTo = "Resolved") =>
  driver(true, waitSecs, resolveTo);

const neo4jDesktopApi = {
  getContext: () => Promise.resolve({ x: 1 }),
  onContextUpdate: fn => {
    fn(1);
  }
};

```
