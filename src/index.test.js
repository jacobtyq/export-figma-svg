require("dotenv").config();
const svgHelper = require("./index");
jest.mock("./index");

describe("Figma Rest API", () => {
  it("is able to get a response", async () => {
    // Given

    // When

    console.log("heloer", await svgHelper);

    // Then
    expect(svgHelper.mock.calls).toEqual([]);
  });
});
