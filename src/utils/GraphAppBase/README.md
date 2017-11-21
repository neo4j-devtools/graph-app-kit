This component saves you from writing boilerplate code to handle active graph connection switches.
You pass in you application to this components render property function which leaves you in total control your apps behaviour, functionality and looks.  
In addition to keeping track of the connection status and reconnect on graph switches this component also adds a `driver` object in application context so it's reachable from all components.
With this object you can create sessions and send cypher to be executesd on the graph. 
Components like the `<Cypher>` component uses this driver from the context to run queries and provide you with the result.  
See the `<DriverProvider>` component for more info on this.

**Render property function signature**  
The render prop function provides one argument object which has 5 properties:

```javascript static
// The state of the connection reachable in the apps context
type connectionState = 
  'CONNECTED' |
  'DISCONNECTED'

// If there's an connection error, the error object will be here
const connectionDetails = {
  message: string
} | null

// Pass connection handling prt of component what the connection credentials are.
// Useful for cases where the Desktop app passes the wrong (or none) credentials the graph apps.
function setCredentials(username: string, password: string): void {
}

// Declaration of function to be used further down in these docs
function eventCallback(event: {type: string}, newContext: {}, oldContext): void {
}

// Add listeners for neo4jDesktopApi events. See the neo4jDesktopApi spec for events that
// are available.
function on(eventType: string, cb: eventCallback) {
}

// Remove neo4jDesktopApi listener
function off(eventType: string, cb: eventCallback) {
}

// Object containing data about the current Neo4j Desktop environment, including all projects etc.
// See neo4jDesktopApi spec for a complete type definition of this.
const context = {
  global: {
    settings: {

    }
  },
  projects: [
    { graphs: [], id: string, name: string }
  ]
}

```

### Usage

```javascript static
const neo4j = require("neo4j-driver/lib/browser/neo4j-web.min.js").v1;
const integrationPoint = window.neo4jDesktopApi

const MyApp = () => <h2>This is my app!</h2>

const App = () => (
  <GraphAppBase
    driverFactory={neo4j}
    render={({ connectionState, connectionDetails, setCredentials, on, off, context }) => (
      <MyApp />
    )}
    integrationPoint={integrationPoint}
  />
);

ReactDOM.render(<App />, document.getElementById('root'))
```

### Username + Password prompt
For convienience reasons there's a credentials form included in this component which can be used to collect username + password from the user in the cases where Neo4j Desktop does not know about it.  
Here's example usage code for it:

```javascript static
const neo4j = require("neo4j-driver/lib/browser/neo4j-web.min.js").v1;
const integrationPoint = window.neo4jDesktopApi;

const MyApp = ({ data }) => {
  return <p>Hello</p>;
};

export const Component = () => (
  <GraphAppBase
    driverFactory={neo4j}
    integrationPoint={integrationPoint}
    render={({
      connectionState,
      connectionDetails,
      setCredentials,
      on,
      off,
      context
    }) => {
      return [
        <ConnectModal
          key="modal"
          errorMsg={connectionDetails ? connectionDetails.message : ""}
          onSubmit={setCredentials}
          show={connectionState !== CONNECTED}
        />,
        <MyApp key="app" data={context} />
      ];
    }}
  />
);

ReactDOM.render(<App />, document.getElementById('root'))
```