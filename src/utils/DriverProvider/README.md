## DriverProvider
Provide your React application with a `neo4j-driver` in application context.  
The `<Cypher>` component recognizes the driver in context and uses it by default.

## Examples

```javascript
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "password"))

// Pass driver via context for apps
const App = () => (
  <DriverProvider driver={driver}>
    <Cypher
      query='RETURN rand() as n'
      render={({pending, error, result}) => {
        return pending ? 'pending' : error ? error.message : result.records[0].get('n')
      }}
    />
  </DriverProvider>
)
render(<App />, document.getElementById('root'))

```
