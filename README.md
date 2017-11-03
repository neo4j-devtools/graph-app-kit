## Graph App Kit

Build Neo4j Graph Apps using components and utilities from this graph app kit.  
This kit should be considered to be 'under development' and the components in it can have breaking changes (i.e. until version `1.0.0` semver does not apply).

Browse source code and read README:s in sub directories for examples and docs.

## What's in here (so far)

### User interface components

| Component  | Description  |
|---|---|
| [&lt;Render>](https://github.com/neo4j-contrib/graph-app-kit/tree/master/src/ui/Render) | A declarative toggling component to mount / unmount child components under certain conditions.  |
| ]&lt;AsciiTable>](https://github.com/neo4j-contrib/graph-app-kit/tree/master/src/ui/AsciiTable) | Render your data in an text/ascii table with fixed width font.  |

### Utility components

| Component  | Description  |
|---|---|
| [&lt;Cypher>](https://github.com/neo4j-contrib/graph-app-kit/tree/master/src/utils/Cypher)  | A simple component to execute a Cypher query and return the result to your render function.  |
| [&lt;DesktopIntegration>](https://github.com/neo4j-contrib/graph-app-kit/tree/master/src/utils/DesktopIntegration) | Easy integration for your app into the Neo4j Desktop API. Subscribe to events etc.  |
| [&lt;DriverProvider>](https://github.com/neo4j-contrib/graph-app-kit/tree/master/src/utils/DriverProvider) | Provide your React application with a [`neo4j-driver`](https://github.com/neo4j/neo4j-javascript-driver) in application context. |

## Install and import

```bash
npm install graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
// or
yarn add graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
```

```javascript
import { Cypher, DriverProvider } from 'graph-app-kit/utils'
import { Render } from 'graph-app-kit/ui'
```

## Component playground / library

There's an interactive playground to view and modify the components.  
This is temporarily hosted at https://styleguide-oipiezsosg.now.sh.  
Feedback wanted!

To use the playground when developing components: `yarn playground` and to generate a static version to deploy: `yarn playground:build` (the artifacts end up in `styleguide/`)

## Development mode

```bash
git clone git@github.com:neo4j-contrib/graph-app-kit.git graph-app-kit
cd graph-app-kit
yarn install
```

### Linting

```bash
yarn lint
```

### Testing

Single run:

```
yarn test
```

Continous testing (watch mode):

```bash
yarn dev
```
