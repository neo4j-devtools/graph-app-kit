import { helpers as integrationHelpers } from "../DesktopIntegration";

export const connectDriver = (
  credentials,
  driverFactory,
  onConnectionSuccessful,
  onConnectionFailure,
  settings
) => {
  const { host, username, password, encrypted } = credentials;
  var driver = null;
  const auth =
    username && password
      ? driverFactory.auth.basic(username, password)
      : undefined;
  try {
    driver = driverFactory.driver(host, auth, {
      connectionTimeout: 5000,
      ...settings,
      encrypted
    });
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
        const activeProject = integrationHelpers.getActiveProject(context);
        const activeGraph = integrationHelpers.getActiveGraph(context);
        if (credentials) {
          onNewActiveGraph(
            credentials,
            { name: activeProject.name, id: activeProject.id },
            {
              name: activeGraph.name,
              id: activeGraph.id,
              description: activeGraph.description
            }
          );
        } else {
          onNoActiveGraph();
        }
      })
      .catch(e => {}); // Catch but don't bother
    integrationPoint.onContextUpdate((event, newContext, oldContext) => {
      switch (event.type) {
        case "GRAPH_ACTIVE":
          const credentials = getActiveDatabaseCredentials(newContext);
          const activeProject = integrationHelpers.getActiveProject(newContext);
          const activeGraph = integrationHelpers.getActiveGraph(newContext);
          if (credentials) {
            onNewActiveGraph(
              credentials,
              { name: activeProject.name, id: activeProject.id },
              {
                name: activeGraph.name,
                id: activeGraph.id,
                description: activeGraph.description
              }
            );
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
