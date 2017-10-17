## Graph App Kit

Build Neo4j Graph Apps using components and libraries from this kit.
Browse source code and read README:s in sub directories for examples and docs.

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

## Development

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
