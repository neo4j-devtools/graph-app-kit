Conditinally render child component.

```javascript
<Sidebar
  topNavItems={[
    {
      name: "Tick",
      title: "Tick button",
      icon: isOpen => <span>{"\u2714"}</span>,
      content: <span>Tick</span>
    },
    {
      name: "Cross",
      title: "Cross button",
      icon: isOpen => <span>{"\u2716"}</span>,
      content: <span>Cross</span>
    }
  ]}
/>;
```
