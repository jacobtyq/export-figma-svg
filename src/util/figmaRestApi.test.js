require("dotenv").config();
const axios = require("axios");
const figmaRestApi = require("./figmaRestApi");

jest.mock("axios");
jest.mock("./figmaRestApi", () => {
  return {
    baseURL: "https://baseurl.here",
    headers: {
      "X-Figma-Token": "DEV_TOKEN",
    },
    request: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
        },
      ],
    }),
  };
});

describe("Tests figmaRestApi", () => {
  // const OLD_ENV = process.env;
  // beforeEach(() => {
  //   jest.resetModules();
  //   process.env = {
  //     ...OLD_ENV,
  //     FIGMA_PROJECT_ID: "12345",
  //     FIGMA_PROJECT_NODE_ID: "1:123",
  //     DEV_ACCESS_TOKEN: "SOMETOKENHERE",
  //   };

  //   afterEach(() => {
  //     process.env = OLD_ENV;
  //   });
  // });

  it("retrieves data from API", async () => {
    // axios.get.mockImplementationOnce(() => Promise.resolve(data));

    expect(figmaRestApi.get.mock.calls.length).toEqual();
  });
});
