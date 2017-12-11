Conditinally render child component.

```javascript
<Sidebar
  topNavItems={[
    {
      name: "Tick",
      title: "Tick button",
      icon: isOpen => <div>{"\u2714"}</div>,
      content: <span>Tick</span>
    },
    {
      name: "Cross",
      title: "Cross button",
      icon: isOpen => <div>{"\u2716"}</div>,
      content: <span>Cross</span>
    }
  ]}
  bottomNavItems={[
    {
      name: "About",
      title: "About",
      icon: isOpen => null,
      content: <span>Abouta</span>
    }
  ]}
/>;
```
