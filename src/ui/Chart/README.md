Render data in a Chart visualization

Static data (XY)
```jsx
<Chart
  data={[{ x: 1, y: 116 }, { x: 2, y: 145 }, { x: 3, y: 157 }, { x: 4, y: 64 }, { x: 5, y: 152 }]}
  title="Static xy data"
  chartType="line-point"
  type="json"
  yAxisLabel="Amount"
/>
```
Static data (curcular):
```jsx
<Chart
  data={
    [
      { label: "Used", value: 30},
      { label: "Free", value: 20}
    ]
  }
  title="Static circular data"
  chartType="doughnut"
  type="json"
/>
```

By executing Cypher (XY):
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
