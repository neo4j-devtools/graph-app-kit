A React component that connects to the Neo4j Desktop API and enabled you to attach properties to it to act on events.  
See API spec to see the signature for event listener functions and for avaialble events.  

If event type is `GRAPH_ACTIVE`, the property to attach to the component is `onGraphActive`. 
Same pattern goes for all event types.

```javascript static
<DesktopIntegration
  integrationPoint={neo4jDesktopApi}
  onMount={mountFn} // Will be called once on component mount
  onGraphActive={activeDBFn} // Will be called on ACTIVE_GRAPH events
  onDatabaseCreated={dbCreatedFn} // Will be called on DATABASE_CREATED events
/>
```
