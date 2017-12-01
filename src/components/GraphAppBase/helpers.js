import { helpers as integrationHelpers } from "../DesktopIntegration";

export const connectDriver = (
  credentials,
  driverFactory,
  onConnectionSuccessful,
  onConnectionFailure
) => {
  const { host, username, password, encrypted } = credentials;
  var driver = null;
  const auth =
    username && password
      ? driverFactory.auth.basic(username, password)
      : undefined;
  try {
    driver = driverFactory.driver(host, auth, { encrypted });
  } catch (e) {
    onConnectionFailure(e);
    return;
  }
  driver.onError = onConnectionFailure;
  const tmp = driver.session();
  if (tmp) {
    tmp
      .run("CALL db.indexes()")
      .then(() => {
        onConnectionSuccessful(driver);
        tmp.close();
      })
      .catch(() => {
        tmp.close();
        onConnectionFailure();
      });
  }
};

export const getActiveDatabaseCredentials = context => {
  const creds = integrationHelpers.getActiveCredentials("bolt", context);
  if (creds) {
    return {
      host: `bolt://${creds.host}:${creds.port}`,
      encrypted: creds.tlsLevel === "REQUIRED",
      username: creds.username,
      password: creds.password
    };
  } else {
    return null;
  }
};

export const subscribeToDatabaseCredentialsForActiveGraph = (
  integrationPoint,
  onNewActiveGraph,
  onNoActiveGraph
) => {
  if (integrationPoint && integrationPoint.getContext) {
    integrationPoint
      .getContext()
      .then(context => {
        const credentials = getActiveDatabaseCredentials(context);
        if (credentials) {
          onNewActiveGraph(credentials);
        } else {
          onNoActiveGraph();
        }
      })
      .catch(e => {}); // Catch but don't bother
    integrationPoint.onContextUpdate((event, newContext, oldContext) => {
      switch (event.type) {
        case "GRAPH_ACTIVE":
          const credentials = getActiveDatabaseCredentials(newContext);
          if (credentials) {
            onNewActiveGraph(credentials);
          } else {
            onNoActiveGraph();
          }
          break;
        case "GRAPH_INACTIVE":
          onNoActiveGraph();
          break;
        default:
          break;
      }
    });
  }
};
