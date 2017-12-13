Component that create a sidebar that allows configuration of buttons with
content that is shown in a animated 'drawer'

### Basic usage:

```javascript
<Sidebar
  // onChange
  // openDrawer
  // defaultOpenDrawer
  // contentWidth
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

<!-- ```javascript
<Sidebar
  topNavItems={[
    {
      name: "Tick",
      title: "Tick button",
      icon: <div>{"\u2714"}</div>,
      drawerContent: <span>Tick</span>
    },
    {
      name: "Cross",
      title: "Cross button",
      icon: <div>{"\u2716"}</div>,
      drawerContent: <span>Cross</span>
    }
  ]}
  bottomNavItems={[
    {
      name: "About",
      title: "About",
      icon: <div>{"\u2716"}</div>,
      drawerContent: <span>About</span>
    }
  ]}
/>;
```

### Advanced usage:

Custom button rendering

```javascript
<Sidebar
  openDrawer="Tick"
  _renderItem={item => {
    const { name, title, icon, isOpen } = item;
    return (
      <div title={title}>
        {isOpen ? "Open" : name}
        {icon}
      </div>
    );
  }}
  topNavItems={[
    {
      name: "Tick",
      title: "Tick button",
      icon: <div>{"\u2714"}</div>,
      drawerContent: <span>Tick</span>
    },
    {
      name: "Cross",
      title: "Cross button",
      icon: <div>{"\u2716"}</div>,
      drawerContent: <span>Cross</span>
    }
  ]}
  bottomNavItems={[
    {
      name: "About",
      title: "About",
      drawerContent: <span>About</span>
    }
  ]}
/>;
``` -->
