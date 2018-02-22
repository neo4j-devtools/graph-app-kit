Provide your React application with a `neo4j-driver` in application context.  
The `<Cypher>` component recognizes the driver in context and uses it by default.

Using a mock driver:

```jsx
<DriverProvider driver={resolvingDriver(3, 'yas!')}>
  <Cypher
    query="RETURN rand() as n"
    render={({ pending, error, result }) => {
      return pending ? "pending" : error ? error.message : result;
    }}
  />
</DriverProvider>

```

Using a connected Neo4j Driver:

```jsx
const neo4j = require("neo4j-driver/lib/browser/neo4j-web.min.js").v1;

const App = () => {
  const localDriver = neo4j.driver("bolt://localhost");

  return (
    <DriverProvider driver={localDriver}>
      <Cypher
        query="RETURN rand() as n"
        render={({ pending, error, result }) => {
          return pending ? "pending" : error ? error.message : result;
        }}
      />
    </DriverProvider>
   );
 };
```
