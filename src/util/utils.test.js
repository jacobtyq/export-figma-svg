const Utils = require("./utils");

describe("Converts camelCase to kebab-case", () => {
  it("changes bookName to book-name", () => {
    expect(Utils.camelCaseToDash("bookName")).toEqual("book-name");
  });
});

describe("Flatten Array", () => {
  it("flattens an deep nested array", () => {
    const array = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
    const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(Utils.flattenArray(array, Infinity)).toEqual(result);
  });

  it("flattens an array up to 2 levels deep", () => {
    const array = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
    const result = [1, 2, 3, 4, 5, 6, [7, 8, [9, 10]]];
    expect(Utils.flattenArray(array, 2)).toEqual(result);
  });
});
