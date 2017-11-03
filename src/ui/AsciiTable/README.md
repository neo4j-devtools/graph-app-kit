Render data in an ascii table for fixed width copy / paste.

```js
const unserializedData = [
  ["Col 1", "Col 2"],
  ["R1C1", ["an", "array"]],
  ["R2C1", { a: "an", b: "object" }],
  ["R3C1", [true, null, false, 1]],
  ["R4C1", "This is a string that will wrap to next line due to maxColWidth"]
];

<AsciiTable data={unserializedData} maxColWidth={25} />
```
