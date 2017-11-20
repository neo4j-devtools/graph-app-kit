## Graph App Kit

Build Neo4j Graph Apps using components and utilities from this graph app kit.\
This kit should be considered to be 'under development' and the components in it
can have breaking changes (i.e. until version `1.0.0` semver does not apply).

Browse source code and read README:s in sub directories for examples and docs.

Check out the [playground](https://styleguide-cfwhbmcpbf.now.sh).

## What's in here (so far)

### User interface components

| Component                                                                                    | Description                                                                                    |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [&lt;Render>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/ui/Render)         | A declarative toggling component to mount / unmount child components under certain conditions. |
| [&lt;AsciiTable>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/ui/AsciiTable) | Render your data in an text/ascii table with fixed width font.                                 |
| [&lt;Chart>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/ui/Chart)           | Render your data in a chart visualization.                                                     |
| [&lt;CodeMirror>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/ui/CodeMirror) | A cypher editor component with code highlighting and autocomplete functionality.               |


### Utility components

| Component                                                                                                       | Description                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [&lt;GraphAppBase>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/utils/GraphAppBase)             | A base component for apps to reduce the amount of boilerplate code for connection handling. Integrates the app with the Neo4j Desktop API and provides the application with a [`neo4j-driver`](https://github.com/neo4j/neo4j-javascript-driver) in application context. |
| [&lt;Cypher>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/utils/Cypher)                         | A simple component to execute a Cypher query and return the result to your render function.                                                                                                                                                                              |
| [&lt;DesktopIntegration>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/utils/DesktopIntegration) | Easy integration for your app into the Neo4j Desktop API. Subscribe to events etc.                                                                                                                                                                                       |
| [&lt;DriverProvider>](https://github.com/neo4j-apps/graph-app-kit/tree/master/src/utils/DriverProvider)         | Provide your React application with a [`neo4j-driver`](https://github.com/neo4j/neo4j-javascript-driver) in application context.                                                                                                                                         |

## Install and import

```bash
npm install graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
// or
yarn add graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
```

```javascript
import 'semantic-ui-css/semantic.min.css'
import { Cypher } from 'graph-app-kit/utils/Cypher'
import { DriverProvider } from 'graph-app-kit/utils/DriverProvider'
import { Render } from 'graph-app-kit/ui/Render'
import { Chart } from 'graph-app-kit/ui/Chart'
import { CodeMirror } from 'graph-app-kit/ui/CodeMirror'
```

## Component playground / library

There's an interactive playground to view and modify the components.\
This is temporarily hosted at https://styleguide-cfwhbmcpbf.now.sh

Feedback wanted!

To use the playground when developing components: `yarn playground` and to
generate a static version to deploy: `yarn playground:build` (the artifacts end
up in `styleguide/`)

## Development mode

```bash
git clone git@github.com:neo4j-apps/graph-app-kit.git graph-app-kit
cd graph-app-kit
yarn install
```

### Dev environment setup

The preferred way to develop new components is to either develop it directly in
`src/dev/Component` or import there.\
To start dev server on http://localhost:3000/ (loads `src/dev/index.js` in webpack):
`yarn start`\
To have continous testing (add tests to `src/dev/Component.test.js`): `yarn dev`

### Exposing components

Here's a checklist for things to be done before opening a PR with a new
component:

1. Restore `src/dev` to it's initial state.
1. Name the component file `ComponentName.js` and the test file
   `ComponentName.test.js`.
1. Export the component as a named export + a default export. Named for the kit
   users and default for placing it in the playground.
1. Add an `index.js` in the components directory, which just exports the named
   import. i.e. `export { ComponentName } from './ComponentName'`.
1. Execute `yarn test` and make sure the test coverage for the component is
   reasonable.
1. Add a `README.md` in the components directory where you showcase one (or
   more) example usages and instructions of the component.
1. Execute `yarn playground` to see it in action. Make sure it looks good and
   makes sense.
1. Add an import test for the component in `test_package/react/package.test.js`
   AND `test_package/preact/preact.test.js`. Execute `yarn test:package` and
   watch it fail.
1. Add the component to the file `conf/kit_exports.js`. Follow the named / path
   convention.
1. Execute `yarn test:package` again and watch it pass.
1. Open a PR and wait for praise.

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
