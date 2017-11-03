Provide your React application with a `neo4j-driver` in application context.  
The `<Cypher>` component recognizes the driver in context and uses it by default.

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
