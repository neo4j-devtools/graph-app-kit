Component that creates a sidebar that allows configuration of buttons with
content that is shown in a animated 'drawer'

### Simple un-controlled component usage:

```javascript
<Sidebar
  contentWidth="300px"
  render={({ selected, applySelectedClass }) => (
    <Sidebar.Container>
      <Sidebar.Top>
        <Sidebar.Item name="a">
          <Sidebar.Button className={applySelectedClass("selected top bar")}>
            B1
          </Sidebar.Button>
          <Sidebar.Content>C1</Sidebar.Content>
        </Sidebar.Item>
      </Sidebar.Top>
      <Sidebar.Bottom>
        <Sidebar.Item name="b">
          <Sidebar.Button>B2</Sidebar.Button>
          <Sidebar.Content>C2</Sidebar.Content>
        </Sidebar.Item>
      </Sidebar.Bottom>
    </Sidebar.Container>
  )}
/>;
```

#### Controlled component usage:

Will read in `openDrawer` prop and react to any changes to the prop. The `onChange` callback will be triggered when a sidebar button is clicked. If `defaultOpenDrawer` prop is set then only that content will be shown.

```javascript
<Sidebar
onChange={(name) => console.log("Name of open drawer:", name)}
openDrawer='a'
render={({ selected, applySelectedClass }) => (
    <Sidebar.Container>
      <Sidebar.Top>
        <Sidebar.Item name="a">
          <Sidebar.Button className={applySelectedClass("selected top bar")}>
            B1
          </Sidebar.Button>
          <Sidebar.Content>C1</Sidebar.Content>
        </Sidebar.Item>
      </Sidebar.Top>
      <Sidebar.Bottom>
        <Sidebar.Item name="b">
          <Sidebar.Button>B2</Sidebar.Button>
          <Sidebar.Content>C2</Sidebar.Content>
        </Sidebar.Item>
      </Sidebar.Bottom>
    </Sidebar.Container>
  )}
/>;
```