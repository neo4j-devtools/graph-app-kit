import * as h from "./helpers";

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
