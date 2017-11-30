import * as h from "./utils";

test("shallowEqual does what it says", () => {
  // Given
  const tests = [
    // Failures
    { one: false, two: true, shouldEqual: false },
    { one: 1, two: 2, shouldEqual: false },
    { one: "one", two: "two", shouldEqual: false },
    { one: null, two: {}, shouldEqual: false },
    {
      one: { i: 11, j: "string" },
      two: { i: 12, j: "string" },
      shouldEqual: false
    },
    { one: [1], two: [2], shouldEqual: false },
    {
      one: { i: { x: 12 }, j: "string" }, // Too deep
      two: { i: { x: 12 }, j: "string" },
      shouldEqual: false
    },

    // Successes
    { one: false, two: false, shouldEqual: true },
    { one: 1, two: 1, shouldEqual: true },
    { one: "one", two: "one", shouldEqual: true },
    { one: null, two: null, shouldEqual: true },
    { one: [1], two: [1], shouldEqual: true },
    {
      one: { i: 12, j: "string" },
      two: { i: 12, j: "string" },
      shouldEqual: true
    }
  ];
  // When & Then
  tests.forEach(t => {
    expect(h.shallowEqual(t.one, t.two)).toEqual(t.shouldEqual);
  });
});

test("stringifyMod works just as JSON.stringify with no modFn", () => {
  // Given
  const tests = [
    { x: 1, y: ["yy", true, undefined, null] },
    null,
    false,
    [[], [0]],
    4
  ];

  // When & Then
  tests.forEach(t => {
    expect(h.stringifyMod(t)).toEqual(JSON.stringify(t));
  });
});

test("stringifyMod works just as JSON.stringify with modFn", () => {
  // Given
  const modFn = val => {
    if (Number.isInteger(val)) return val.toString();
  };
  const tests = [null, false, [[], [0]], "4", 4, ["string"]];
  const expects = [
    "null",
    "false",
    JSON.stringify([[], [0]]),
    '"4"',
    "4",
    '["string"]'
  ];

  // When & Then
  tests.forEach((t, index) => {
    expect(h.stringifyMod(t, modFn)).toEqual(expects[index]);
  });
});
test("stringifyMod can add spaces on the output", () => {
  // Given
  const tests = [
    false,
    [[], [0]],
    {
      prop1: 1,
      prop2: [
        {
          innerProp: "innerVal",
          innerProp2: [
            { innerInner: "innerVal2", innerInner2: "innerInnerVal2" }
          ]
        }
      ]
    },
    ["string"]
  ];
  const expects = [
    "false",
    JSON.stringify([[], [0]], null, 2),
    JSON.stringify(
      {
        prop1: 1,
        prop2: [
          {
            innerProp: "innerVal",
            innerProp2: [
              { innerInner: "innerVal2", innerInner2: "innerInnerVal2" }
            ]
          }
        ]
      },
      null,
      2
    ),
    JSON.stringify(["string"], null, 2)
  ];

  // When & Then
  tests.forEach((t, index) => {
    expect(h.stringifyMod(t, null, true)).toEqual(expects[index]);
  });
});
