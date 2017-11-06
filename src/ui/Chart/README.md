Render data in a Chart visualization

Static data:
```jsx
<Chart
  data={[{ x: 1, y: "116" }, { x: 2, y: "145" }, { x: 3, y: "157" }, { x: 4, y: "64" }, { x: 5, y: "152" }]}
  title="Static Data"
  chartType="area"
  type="json"
  setYAxis="200"
/>
```

By executing Cypher:
```jsx
const stubCypherResult = {
  records: [
    {
      get: () => Math.floor((Math.random() * 100) + 1),
      keys: () => null
    }
  ]
};

<DriverProvider driver={resolvingDriver(3, stubCypherResult)}>
  <Chart
    query='RETURN rand() as n'
    title="Data from db"
    chartType="bar"
    type="cypher"
  />
</DriverProvider>
```
