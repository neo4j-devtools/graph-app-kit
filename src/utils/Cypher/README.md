## Cypher

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


// or via props for standalone components
render(
  <Cypher
    driver={driver}
    query='RETURN rand() as n'
    render={({pending, error, result}) => {
      return pending ? 'pending' : error ? error.message : result.records[0].get('n')
    }}
  />
, document.getElementById('root'))


```

## &lt;Cypher> render property API

### render ({ pending, error, result, tick })
This function will be called on every render.

#### Arguments

```javascript
type obj = {
  pending: boolean,
  error: ErrorObject,
  result: BoltResult,
  tick: number // auto increasing number
}

type ErrorObject = {
  type: string,
  message: string
}

type BoltResult = {
  records: Array<ResultRecord>,
  summary: SummaryObject
}

type ResultRecord = {
  // ...
}

type SummaryObject = {
  // ...
}
```
