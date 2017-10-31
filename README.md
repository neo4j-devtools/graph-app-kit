## Graph App Kit

Build Neo4j Graph Apps using components and utilities from this graph app kit.  
This kit should be considered to be 'under development' and the components in it can have breaking changes (i.e. until version `1.0.0` semver does not apply).

Browse source code and read README:s in sub directories for examples and docs.

## What's in here (so far)

### User interface components

|   |   |
|---|---|
| [&lt;Render>](tree/master/src/ui/Render) | A declarative toggling component to mount / unmount child components under certain conditions.  |
|   |   |

### Utilities components

|   |   |
|---|---|
| [&lt;Cypher>](tree/master/src/utils/Cypher)  | A simple component to execute a Cypher query and return the result to your render function.  |
| [&lt;DesktopIntegration>](tree/master/src/utils/DesktopIntegration) | Easy integration for your app into the Neo4j Desktop API. Subscribe to events etc.  |
| [&lt;DriverPRovider>](tree/master/src/utils/DriverProvider) | Provide your React application with a [`neo4j-driver`](https://github.com/neo4j/neo4j-javascript-driver) in application context. |
|||

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
