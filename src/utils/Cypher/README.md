A component that handles the request and response part of sending a cypher query to a Neo4j instance.
Does not render anything by itself, so a `render` property is required, which is expected to return what to render.
This `render` property gets passed the state properties of the `Cypher` component, like `pending`, `error`, `result` and `tick`.
See below for the complete signature.

```jsx
<Cypher
  driver={rejectingDriver(3, 'no!')}
  query='RETURN rand() as n'
  render={({pending, error, result, tick}) => {
    return pending ? 'pending' : error ? error.message : result
  }}
/>
```

### &lt;Cypher> render property API

#### render ({ pending, error, result, tick })
This function will be called on every render and this is where you return what to render.

##### Arguments

```js static
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
