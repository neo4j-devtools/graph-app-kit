import { applyDataLimit, asPercentage } from "./chartHelpers";

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

describe("calculates percentage", () => {
  it("should be 50", () => {
    const total = 10;
    const value = 5;
    expect(asPercentage(total, value)).toBe("50.00");
  });
  it("should handle 2 decial places", () => {
    const total = 100;
    const value = 99.514;
    expect(asPercentage(total, value)).toBe("99.51");
  });
  it("should be 50", () => {
    const total = 15.0;
    const value = 7.5;
    expect(asPercentage(total, value)).toBe("50.00");
  });
});
