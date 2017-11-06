import { applyDataLimit } from "./chartHelpers";

describe("applyDataLimit", () => {
  it("returns array items if array length is smaller than the limit", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const limit = 10;
    expect(applyDataLimit(array, limit).length).toBe(9);
    expect(applyDataLimit(array, limit)).toEqual(expect.arrayContaining(array));
  });
  it("returns array items if array length is equal to the limit", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const limit = 10;
    expect(applyDataLimit(array, limit).length).toBe(10);
    expect(applyDataLimit(array, limit)).toEqual(expect.arrayContaining(array));
  });
  it("returns array items if array length is equal to the limit", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const limit = 10;
    expect(applyDataLimit(array, limit).length).toBe(10);
    expect(applyDataLimit(array, limit)).toEqual(expect.arrayContaining(array));
  });
  it("return removes items from the begining of array if array length is greater than the limit", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const expected = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const limit = 10;
    expect(applyDataLimit(array, limit).length).toBe(10);
    expect(applyDataLimit(array, limit)).toEqual(
      expect.arrayContaining(expected)
    );
  });
});
