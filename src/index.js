require("dotenv").config();
const { performance } = require("perf_hooks");
const axios = require("axios");
const figmaRestApi = require("./util/figmaRestApi");
const Utils = require("./util/utils");
const outputFolder = "./src/svg/";
const rateLimit = 20;

const svgHelper = async () => {
  try {
    console.log(performance.now());
    console.log(
      "url",
      "files/" +
        process.env.FIGMA_BASE_URL +
        process.env.FIGMA_PROJECT_ID +
        "/nodes?ids=" +
        process.env.FIGMA_PROJECT_NODE_ID
    );
    const response = await figmaRestApi.get(
      "files/" +
        process.env.FIGMA_PROJECT_ID +
        "/nodes?ids=" +
        process.env.FIGMA_PROJECT_NODE_ID
    );
    const children = await response.data.nodes[
      process.env.FIGMA_PROJECT_NODE_ID
    ].document.children;

    const svgs = Utils.findAllByValue(children, "INSTANCE");
    const numOfSvgs = svgs.length;

    console.log("Number of SVGs", numOfSvgs);

    Utils.createFolder(outputFolder);

    for (i = 0; i < numOfSvgs; i += rateLimit) {
      const requests = svgs.slice(i, i + rateLimit).map(async (svg) => {
        // Get URL of each SVG
        let svgName = await svg.name;

        if (svgName.includes("/")) {
          const nameArr = svg.name.split("/").join("-");
          svgName = nameArr;
        }

        const svgURL = await figmaRestApi.get(
          "images/" +
            process.env.FIGMA_PROJECT_ID +
            "/?ids=" +
            svg.id +
            "&format=svg"
        );

        // Get SVG DOM
        const svgDOM = await axios.get(svgURL.data.images[svg.id]);
        Utils.writeToFile(
          outputFolder + `${Utils.camelCaseToDash(svgName)}.svg`,
          svgDOM.data
        );
      });

      await Promise.all(requests)
        .then(() => {
          console.log("Wait for 45 seconds");
          return new Promise(function (resolve) {
            setTimeout(() => {
              console.log("45 seconds!");
              resolve();
            }, 45000);
          });
        })
        .catch((err) => console.error(`Error proccessing ${i} - Error ${err}`));
    }
  } catch (err) {
    console.error(err);
  }
};

svgHelper();
