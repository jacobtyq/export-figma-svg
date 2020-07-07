require("dotenv").config();
const figmaRestApi = require("./util/figmaRestApi");

const svgHelper = async () => {
  try {
    const response = await figmaRestApi;
    console.log("res", response);
  } catch (err) {
    console.log("error");
    console.error(err);
  }
};

svgHelper();
