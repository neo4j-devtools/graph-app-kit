## graph-app-kit

Build Neo4j Graph Apps using components and libraries from this kit.

## Install and import

```bash
npm install graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
```

```javascript
import { Cypher, DriverProvider } from 'graph-app-kit/utils'
```

## Usage

```javascript
<Cypher
  query='RETURN rand() as n' // Cypher query. (required)
  render={({pending, error, result}) => { // Function to be called on render (required)
    return pending ? 'pending' : error ? error.message : result.records[0].get('n')
  }}
  driver={driver} // neo4j-driver (optional)
  params={{id: 1}} // Params to be passed with the query (optional)
  interval={10} // Run every 10 seconds (optional)
/>
```

```javascript
<DriverProvider driver={driver}>
  // driver is now available in the context
  <App />
</DriverProvider>

```

## Development

```bash
git clone git@github.com:oskarhane/bolt-components.git bolt-components
cd bolt-components
yarn install
yarn test --coverage
yarn test
```
