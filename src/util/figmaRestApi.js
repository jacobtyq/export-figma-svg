const axios = require("axios");

const figmaRestApi = axios.create({
  baseURL:
    process.env.FIGMA_BASE_URL +
    process.env.FIGMA_PROJECT_ID +
    "/nodes?ids=" +
    process.env.FIGMA_PROJECT_NODE_ID,
  headers: {
    "X-Figma-Token": process.env.DEV_ACCESS_TOKEN,
  },
});

module.exports = figmaRestApi;
