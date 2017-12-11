export const getActiveProject = (context = {}) => {
  if (!context) return null;
  const { projects } = context;
  if (!Array.isArray(projects)) return null;
  const activeProject = projects.find(project => {
    if (!project) return false;
    if (!(project.graphs && Array.isArray(project.graphs))) return false;
    return project.graphs.find(({ status }) => status === "ACTIVE");
  });
  return activeProject || null;
};

export const getActiveGraph = (context = {}) => {
  const activeProject = getActiveProject(context);
  if (!activeProject) return null;
  return activeProject.graphs.find(({ status }) => status === "ACTIVE");
};

export const getCredentials = (type, connection) => {
  if (!connection) return null;
  const { configuration = null } = connection;
  if (
    !(
      configuration &&
      configuration.constructor &&
      configuration.constructor === Object
    )
  ) {
    return null;
  }
  if (
    !(
      configuration.protocols &&
      configuration.protocols.constructor &&
      configuration.protocols.constructor === Object
    )
  ) {
    return null;
  }
  if (typeof configuration.protocols[type] === "undefined") {
    return null;
  }
  return configuration.protocols[type];
};

// XXX_YYY -> onXxxYyy
export const eventToHandler = type => {
  if (typeof type !== "string") return null;
  return (
    "on" +
    splitOnUnderscore(type)
      .filter(notEmpty)
      .map(toLower)
      .map(upperFirst)
      .join("")
  );
};
const notEmpty = str => str.length > 0;
const splitOnUnderscore = str => str.split("_");
const toLower = str => str.toLowerCase();
const upperFirst = str => str[0].toUpperCase() + str.substring(1);

export const didChangeActiveGraph = (newContext, oldContext) => {
  const oldActive = getActiveGraph(oldContext);
  const newActive = getActiveGraph(newContext);
  if (!oldActive && !newActive) return false; // If no active before and after = nu change
  return !(oldActive && newActive && newActive.id === oldActive.id);
};

export const getActiveCredentials = (type, context) => {
  const activeGraph = getActiveGraph(context);
  if (!activeGraph || typeof activeGraph.connection === "undefined")
    return null;
  const creds = getCredentials(type, activeGraph.connection);
  return creds || null;
};
